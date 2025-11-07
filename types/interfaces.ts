export interface EditWidgetSettings {
  content: {
    question: string;
    questions: string[]; // future multi-question support
    submitText: string;
    HeaderTitle: string;
    ThanksTitle: string;
    ThanksMessage: string;
  };

  behavior: {
    devices: {
      mobile: boolean;
      tablet: boolean;
      desktop: boolean;
    };
    excludeUrls: string[];
    includeUrls: string[];
    triggerType: "showImmediately" | "onScroll" | "afterDelay" | "exitIntent" | "manual" | undefined;
  };

  functionality: {
    name: string;
    surveyEnabled: boolean;
    surveyOptions: {
      primaryFeedbackType: "CSAT" | "NPS" | "CES" | string; // allow future survey types
    };
    isReviewsEnabled: boolean;
    isBugReportingEnabled: boolean;
    isFeatureSuggestionEnabled: boolean;
  };
}
