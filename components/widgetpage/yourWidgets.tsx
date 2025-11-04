"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Widget } from "@prisma/client";

import { deleteWidget, pauseWidget, activateWidget, getUserWidgets } from "@/actions/widget";
import { Eye, Pause, Plus, Trash, PlayIcon, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { toast } from "sonner";

const YourWidgets = () => {
  const [userWidgets, setUserWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  // Optimistic delete
  const DeleteWidget = useCallback(async (widgetId: string) => {
    // Optimistic: remove from UI immediately
    setUserWidgets((prev) => prev.filter((w) => w.id !== widgetId));

    const response = await deleteWidget(widgetId);
    if (response.error) {
      toast.error(`Failed to delete: ${response.error}`);
      // Rollback: refetch on error (or restore from backup)
      const res = await getUserWidgets();
      if (res.success && res.data) setUserWidgets(res.data);
    } else {
      toast.success("Widget deleted");
    }
  }, []);

  // Optimistic pause
  const PauseWidget = useCallback(async (widgetId: string) => {
    // Optimistic: update isActive immediately
    setUserWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, isActive: false } : w))
    );

    const response = await pauseWidget(widgetId);
    if (response.error) {
      toast.error(`Failed to pause: ${response.error}`);
      // Rollback
      setUserWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, isActive: true } : w))
      );
    } else {
      toast.success("Widget paused");
    }
  }, []);

  // Optimistic activate
  const ActivateWidget = useCallback(async (widgetId: string) => {
    setUserWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, isActive: true } : w))
    );

    const response = await activateWidget(widgetId);
    if (response.error) {
      toast.error(`Failed to activate: ${response.error}`);
      // Rollback
      setUserWidgets((prev) =>
        prev.map((w) => (w.id === widgetId ? { ...w, isActive: false } : w))
      );
    } else {
      toast.success("Widget activated");
    }
  }, []);

  const goToNew = useCallback(() => router.push("/widget/new"), [router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUserWidgets();
        if (!mounted) return;
        if (res.success && res.data) setUserWidgets(res.data);
        else setError(res.error || "Failed to load widgets");
      } catch {
        if (mounted) setError("Failed to load widgets");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-xl text-neutral-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-xl text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex p-5">
      {userWidgets.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-3 mt-40">
          <div className="p-4 rounded-full bg-green-300">
            <Plus className="text-green-700" />
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <h1>You don't have any widgets yet.</h1>
            <p className="text-sm text-slate-500">
              Create your first widget now.
            </p>
            <Button
              className="px-2 p-3 bg-green-400 text-black hover:bg-green-500"
              onClick={goToNew}
            >
              <Plus />
              Create Widget
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <h2 className="font-extrabold text-xl">Your widgets</h2>
          <div className="grid grid-cols-3 gap-8">
            {userWidgets.map((widget) => (
              <Card
                className="flex w-[350px] border-neutral-200 shadow-md"
                key={widget.id} // ← use widget.id, not index
              >
                <CardHeader>
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <div className="p-2 bg-green-400 rounded-2xl">
                      <MessageSquare className="text-black" />
                    </div>
                    <h2 className="font-bold">{widget.title}</h2>
                    {widget.isActive ? (
                      <div className="flex flex-row items-center justify-center text-black/80 bg-green-400 text-[12px] rounded-2xl p-1 px-2">
                        active
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-center text-black/80 bg-neutral-300 text-[12px] rounded-2xl p-1 px-2">
                        inactive
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row gap-2 items-center mt-4">
                    <Button
                      className="flex flex-row items-center justify-center gap-2 flex-1"
                      onClick={() => router.push(`/widget/${widget.id}`)}
                    >
                      <p>View Details</p>
                      <Eye />
                    </Button>
                    {widget.isActive ? (
                      <Button onClick={() => PauseWidget(widget.id)}>
                        <Pause />
                      </Button>
                    ) : (
                      <Button onClick={() => ActivateWidget(widget.id)}>
                        <PlayIcon />
                      </Button>
                    )}
                    <Button onClick={() => DeleteWidget(widget.id)}>
                      <Trash />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YourWidgets;
