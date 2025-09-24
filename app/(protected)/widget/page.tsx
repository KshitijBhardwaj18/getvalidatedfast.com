import React from "react";
import { PanelsTopLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WidgetHeader from "@/components/widgetpage/header";
import YourWidgets from "@/components/widgetpage/yourWidgets";

function Widget() {
  return (
    <div className="p-5">
      <WidgetHeader/>
      <YourWidgets/>
    </div>
  );
}

export default Widget;
