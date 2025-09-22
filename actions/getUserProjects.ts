"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function getUserProjects() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch projects for the current user through workspace memberships
    const projects = await db.project.findMany({
      where: {
        workspace: {
          memberships: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        workspaceId: true,
        workspace: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data for the component
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      workspaceId: project.workspaceId,
      workspaceName: project.workspace.name,
      value: project.id,
      label: `${project.name} (${project.workspace.name})`,
    }));

    return { success: true, projects: transformedProjects };
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}
