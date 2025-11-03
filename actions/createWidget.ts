"use server"

import { z } from "zod";
import {
  FunctionalitySchema,
  type FunctionalityValues,
  getContentSchema,
  behaviourSchema,
} from "@/types/widgetform";

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

    

}