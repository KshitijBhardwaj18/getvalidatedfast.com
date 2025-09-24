"use client";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Widget } from "@prisma/client";
import { getUserWidgets } from "@/actions/widgets";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

const YourWidgets =  () => {
  const [userWidgets, setUserWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    async () => {
      try {
        const res = await getUserWidgets();
        console.log(res)
        if (!mounted) return;

        if (res.success && res.data) {
          setUserWidgets(res.data);
          setLoading(false)
        } else {
          setError(res.error || "Failed to load Widgets");
        }
      } catch {
        if (mounted) setError("Failed to load widgets");
      }
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
        <div className="flex flex-col justify-center items-center ">
          <h1>You don't have any widgets yet.</h1>
          <Button className="px-2 p-3 bg-green-400 text-black">
            <Plus />
            Create Widget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {userWidgets.map((widget, idx) => (
            <div className="flex shadow-md border border-neutral-400 p-3 flex-col gap-2">
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
