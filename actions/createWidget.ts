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

  const project = session;

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
