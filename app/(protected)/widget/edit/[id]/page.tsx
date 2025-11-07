import HeaderCard from "@/components/headerCard";
import EditWidgetForm from "@/components/widgetpage/editWIdgetForm";
import NewWidgetForm from "@/components/widgetpage/newWidgetForm";
import { Pen, Plus } from "lucide-react";
import React from "react";
import {use} from "react"

const EditWidgetPage = ({params} : {params: Promise<{id: string}>}) => {
  const {id} = use(params)
  return (
    <div className="p-4">
      <HeaderCard
        title="Edit widget"
        description="Make changes to your existing widget"
        icon={<Pen/>}
        actionButton={false}
      />
      <EditWidgetForm widgetId={id} />
    </div>
  );
};

export default EditWidgetPage;
