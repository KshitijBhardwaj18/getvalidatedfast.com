export type SurveyType = "CSAT" | "NPS" | "CUSTOM" | "TESTIMONIALS";

type BaseFeatures = {
  BugReports: boolean;
  FeatureSuggestion: boolean;
  Reviews: boolean;
};

// Survey disabled: no survey-specific fields required
type SurveyOff = {
  Survey: false;
};

// Survey enabled + CUSTOM: multiple questions
type SurveyCustom = {
  Survey: true;
  SurveyType: "CUSTOM";
  SurveyQuestions: string[];     // multiple
  SubmitText: string;
};

// Survey enabled + non-CUSTOM: exactly one question
type SurveySingle = {
  Survey: true;
  SurveyType: Exclude<SurveyType, "CUSTOM">;
  SurveyQuestion: string;        // single
  SubmitText: string;
};

export type WidgetSettings = BaseFeatures & (SurveyOff | SurveyCustom | SurveySingle);