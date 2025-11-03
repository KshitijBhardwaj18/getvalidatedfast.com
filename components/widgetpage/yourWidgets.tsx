"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Widget } from "@prisma/client";
import { getUserWidgets } from "@/actions/widgets";
import { Eye, Pause, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Card, CardAction, CardContent, CardHeader } from "../ui/card";
import { MessageSquare } from "lucide-react";
import { Trash } from "lucide-react";

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
    <div className="flex p-5">
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
            <Button
              className="px-2 p-3 bg-green-400 text-black hover:bg-green-500"
              onClick={() => router.push("widget/new")}
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
            {userWidgets.map((widget, idx) => (
              <Card
                className="flex  w-[350px] border-neutral-200 shadow-md"
                key={idx + widget.createdAt.toDateString()}
              >
                <CardHeader className="">
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <div className="p-2 bg-green-400 rounded-2xl">
                      <MessageSquare className="text-black" />
                    </div>
                    <h2 className="font-bold "> {widget.title}</h2>

                    {widget.isActive ? (
                      <div className="flex flex-row items-center justify-center text-black/80 bg-green-400 text-[12px] rounded-2xl p-1 ">
                        active
                      </div>
                    ) : (
                      <div className="flex flex-row items-center justify-center text-green-600 bg-neutral-400">
                        inactive
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-row gap-2 items-center mt-4">
                    <Button className="flex flex-row items-center justify-center gap-2 flex-1">
                      <p>View Details</p>
                      <Eye />
                    </Button>
                    <Button>
                      <Pause />
                    </Button>
                    <Button>
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
