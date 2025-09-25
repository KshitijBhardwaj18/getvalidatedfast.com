import { z } from "zod";

export const SurveyOptionsSchema = z.object({
  primaryFeedbackType: z.enum(["NPS", "CSAT", "CUSTOM", "TESTIMONIALS"]),
});

export const FunctionalitySchema = z
  .object({
    name: z.string().min(2, "Widget name is required"),
    isReviewsEnabled: z.boolean(),
    isBugReportingEnabled: z.boolean(),
    isFeatureSuggestionEnabled: z.boolean(),
  })
  .and(
    z.discriminatedUnion("surveyEnabled", [
      z.object({
        surveyEnabled: z.literal(false),
      }),
      z.object({
        surveyEnabled: z.literal(true),
        surveyOptions: SurveyOptionsSchema,
      }),
    ])
  );

export type FunctionalityValues = z.infer<typeof FunctionalitySchema>;

export function getContentSchema(opts: {
  surveyEnabled: boolean;
  primaryFeedbackType?: "NPS" | "CSAT" | "CUSTOM" | "TESTIMONIALS";
}) {
  const Base = z.object({
    HeaderTitle: z.string().min(2),
    ThanksTitle: z.string().min(4),
    ThanksMessage: z.string().min(8),
  });

  if (!opts.surveyEnabled) return Base;

  switch (opts.primaryFeedbackType) {
    case "NPS":
    case "CSAT":
      return Base.extend({
        question: z.string().min(2, "Question is required"),
        submitText: z.string().min(1),
      });
    case "CUSTOM":
      return Base.extend({
        questions: z.array(z.string().min(2)).min(1),
        submitText: z.string().min(1),
      });
    case "TESTIMONIALS":
      return Base.extend({
        submitText: z.string().min(1),
      });
    default:
      return Base; // fallback
  }
}

export const behaviourSchema = z.object({
  triggerType: z
    .enum(["showImmediately", "afterDelay", "onScroll", "exitIntent", "manual"])
    .default("showImmediately"),
  includeUrls: z.array(z.string()),
  excludeUrls: z.array(z.string()),
  devices: z
    .object({
      desktop: z.boolean().default(true),
      mobile: z.boolean().default(true),
      tablet: z.boolean().default(true),
    })
    .refine((v) => v.desktop || v.mobile || v.tablet, {
      message: "Select at least one device",
      path: ["desktop"], // or a custom path
    }),
});
