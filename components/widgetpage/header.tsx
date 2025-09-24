import React from "react";
import { PanelsTopLeft, Plus } from "lucide-react";
import { Button } from "../ui/button";

const WidgetHeader = () => {
  return (
    <div className="p-8 rounded-2xl shadow-lg border-1 border-green-400 bg-gradient-to-r from-green-50  to-white  ">
      <div className="flex items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <div className="p-2 rounded-2xl bg-green-300">
            <PanelsTopLeft />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold text-black">Your Widgets</h1>
            <p className="text-sm text-neutral-400">
              Create and manage your widgets. Embed them on your website to
              collect insights from users.
            </p>
          </div>
        </div>

        <div className="">
          <Button className="px-3 py-2 bg-green-400 hover:bg-green-600  flex gap-2 items-center justify-center">
            <Plus />
            Create Widget
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WidgetHeader;
