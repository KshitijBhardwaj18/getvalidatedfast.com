"use server";

import { z } from "zod";
import {
  FunctionalitySchema,
  type FunctionalityValues,
  getContentSchema,
  behaviourSchema,
} from "@/types/widgetform";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

// Type for the Content step (depends on surveyEnabled + primaryFeedbackType)
type ContentSchemaType = ReturnType<typeof getContentSchema>;
type ContentValues = z.infer<ContentSchemaType>;

// Final input type for the create action
export type CreateWidgetInput = {
  functionality: FunctionalityValues;
  content: ContentValues;
  behavior: z.infer<typeof behaviourSchema>;
};

export async function createWidget(values: CreateWidgetInput) {
  const projectId = (await cookies()).get("currentProjectId")?.value;
  if (!projectId) {
    return { success: false, error: "No current Project selected" };
  }
  const session = await auth();

  if (session?.user?.id == null) {
    return { success: false, error: "Authentication faliure" };
  }

  const widget = await db.widget.create({
    data: {
      title: values.functionality.name,
      description: null,
      settings: values as Prisma.InputJsonValue,
      project: { connect: { id: projectId } },
    },
  });

  return { success: true, data: widget };
}

export async function pauseWidget(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const widget = await db.widget.update({
      where: { id: widgetId },
      data: { isActive: false },
    });
    return { success: true, data: widget };
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return { success: false, error: "Widget not found" };
    }
    return { success: false, error: "Failed to pause widget" };
  }
}

export async function activateWidget(widgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const widget = await db.widget.update({
      where: { id: widgetId },
      data: { isActive: true },
    });
    return { success: true, data: widget };
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return { success: false, error: "Widget not found" };
    }
    return { success: false, error: "Failed to activate widget" };
  }
}

export async function deleteWidget(widgetId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorised" };
  }

  try {
    const widget = await db.widget.delete({
      where: { id: widgetId },
    });
    return { success: true, data: widget };
  } catch (err: any) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return { success: false, error: "Widget not found" };
    }

    return { success: false, error: "Failed to pause widget" };
  }
}
