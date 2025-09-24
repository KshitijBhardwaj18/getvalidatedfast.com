import React from "react";

import { Button } from "@/components/ui/button";
import WidgetHeader from "@/components/headerCard";
import YourWidgets from "@/components/widgetpage/yourWidgets";
import HeaderCard from "@/components/headerCard";
import { PanelsTopLeft } from "lucide-react";

function Widget() {
  return (
    <div className="p-5">
      <HeaderCard
        title="Your widgets"
        description="Create and manage your widgets"
        icon={<PanelsTopLeft />}
        actionButton={true}
        actionButtonText="Create Widget"
        actionHref="/widget/new"
      />
      <YourWidgets />
    </div>
  );
}

export default Widget;
