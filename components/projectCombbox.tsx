"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { setCurrentProject } from "@/actions/getUserProjects";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getUserProjects } from "@/actions/getUserProjects";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  workspaceName: string;
  value: string;
  label: string;
}

export function ProjectCombbox() {
  const [open, setOpen] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Fetch user projects using server action
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await getUserProjects();

        if (result.success && result.projects) {
          setProjects(result.projects as Project[]);

          // Set the first project as default
          if (result.projects.length > 0) {
            const firstProject = result.projects[0].value;
            setValue(result.projects[0].value);

            await setCurrentProject(firstProject);
          }
        } else {
          console.error("Failed to fetch projects:", result.error);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project selection
  const handleProjectSelect = async (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);

    const result = await setCurrentProject(currentValue);

    if (result.success) {
      toast.success("Project switched to:" + result.project?.name);

      window.location.reload();
    }

    console.log("Selected project:", currentValue);
  };

  if (loading) {
    return (
      <Button variant="outline" className="w-[200px] justify-between" disabled>
        Loading projects...
        <ChevronsUpDown className="opacity-50" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild className="px-3 ">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mx-3 "
        >
          {value
            ? projects.find((project) => project.value === value)?.label
            : "No projects available"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            {projects.length === 0 ? (
              <CommandEmpty>No projects found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project.value}
                    value={project.value}
                    onSelect={handleProjectSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === project.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {project.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
