"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

export async function getUserWidgets() {
  const session = await auth();

  if (session?.user?.id) {
    return { success: false, error: "Not Authorised", data: null };
  }

  const projectId = (await cookies()).get("currentProjectId")?.value;

  if (!projectId) {
    return { success: false, error: "No current project selected", data: null };
  }

  const widgets = await db.widget.findMany({
    where: {
      projectId: projectId,
      project: {
        workspace: {
          memberships: {
            some: {
              userId: session?.user?.id,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, error: null, data: widgets };
}

export async function createWidget() {

}
