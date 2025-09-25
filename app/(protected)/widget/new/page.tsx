import HeaderCard from "@/components/headerCard";
import NewWidgetForm from "@/components/widgetpage/newWidgetForm";
import { Pen, Plus } from "lucide-react";
import React from "react";

const NewWidget = () => {
  return (
    <div className="p-4">
      <HeaderCard
        title="Create New  Widget"
        description="Follow the steps to create and launch your feedback widget"
        icon={<Pen/>}
        actionButton={false}
      />
      <NewWidgetForm/>
    </div>
  );
};

export default NewWidget;
