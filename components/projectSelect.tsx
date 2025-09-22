import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data: { projectName: string; projectId: string }[] = [
  {
    projectName: "Main Project",
    projectId: "1234",
  },
  {
    projectName: "SideProject",
    projectId: "1235",
  },
];

const ProjectSelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Main Project"  defaultValue={"Main Project"}/>
      </SelectTrigger>
      <SelectContent defaultValue={"Main Project"}>
        {
            data.map((project) =>  <SelectItem key={project.projectId} value={project.projectName}>{project.projectName}</SelectItem>)
        }
      </SelectContent>
    </Select>
  );
};

export default ProjectSelect;
