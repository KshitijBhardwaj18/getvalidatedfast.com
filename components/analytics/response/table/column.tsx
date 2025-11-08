"use clietn";
import { ColumnDef } from "@tanstack/react-table";

export interface ResponseData {
  id: string;
  widgetName: string;
  summary: string;
  user: string;
  date: string;
}

export const columns: ColumnDef<ResponseData>[] = [
  { accessorKey: "widgetName", header: "Widget Name" },
  { accessorKey: "summary", header: "Summary" },
  {
    accessorKey: "user",
    header: "user",
  },
  { accessorKey: "date", header: "Date" },
];

// cell: ({ getValue }) => (
//   <span className="font-semibold">{getValue() as string}</span>
// );
