"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

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
      label: `${project.name}`,
    }));

    return { success: true, projects: transformedProjects };
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

const CURRENT_PROJECT_COOKIE = "currentProjectId";

export async function setCurrentProject(projectId: string) {
  const session = await auth();

  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspace: {
        memberships: { some: { userId: session.user.id } },
      },
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
      workspace: { select: { name: true } },
    },
  });

  if (!project) {
    return { success: false, error: "Access denied" };
  }

  (await cookies()).set(CURRENT_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { success: true, project };
}

export async function getCurrentProject() {
  const session = await auth();
  if (!session?.user?.id) return { project: null };

  const projectId = (await cookies()).get(CURRENT_PROJECT_COOKIE)?.value;
  if (!projectId)
    return { success: null, error: "Not Authorized", project: null };

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      workspace: {
        memberships: { some: { userId: session.user.id } },
      },
    },
    select: {
      id: true,
      name: true,
      workspaceId: true,
      workspace: { select: { name: true } },
    },
  });

  return { success: true, error: null, project: project };
}
