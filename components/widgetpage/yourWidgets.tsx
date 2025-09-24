"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Widget } from "@prisma/client";
import { getUserWidgets } from "@/actions/widgets";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const YourWidgets = () => {
  const [userWidgets, setUserWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await getUserWidgets();
        console.log(res);
        if (!mounted) return;
        if (res.success && res.data) {
          setUserWidgets(res.data);
        } else {
          setError(res.error || "Failed to load Widgets");
        }
      } catch (err) {
        if (mounted) setError("Failed to load widgets");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center text-xl text-neutral-500">
        Loading.....
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center text-xl text-red-600">
        {error}
      </div>
    );
  return (
    <div className="flex items-center justify-center">
      {userWidgets.length == 0 ? (
        <div className="flex flex-col justify-center items-center gap-3  mt-40">
          <div className="p-4 rounded-full bg-green-300 ">
            <Plus className="text-green-700" />
          </div>

          <div className="flex flex-col gap-2 items-center justify-center">
            <h1>You don't have any widgets yet.</h1>
            <p className="text-sm text-slate-500">
              Create your first widget now.
            </p>
            <Button className="px-2 p-3 bg-green-400 text-black hover:bg-green-500" onClick={() => router.push("widget/new")}>
              <Plus />
              Create Widget
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {userWidgets.map((widget, idx) => (
            <div
              key={widget.id ?? idx}
              className="flex shadow-md border border-neutral-400 p-3 flex-col gap-2"
            >
              <h3 className="text-black text-xl font-semibold">
                {widget.title}
              </h3>
              <p className="text-md text-neutral-400">{widget.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YourWidgets;
