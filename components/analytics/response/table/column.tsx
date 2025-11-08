"use clietn";
import { ColumnDef } from "@tanstack/react-table";

interface ResponseData {
  id: string;
  widgetName: string;
  summary: string;
  date: string;
}

export const columns: ColumnDef<ResponseData>[] = [
  { accessorKey: "widget-name", header: "Widget Name" },
  { accessorKey: "summary", header: "Summary" },
  { accessorKey: "date", header: "Date" },
];
