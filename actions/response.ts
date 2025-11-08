"use server";
import { ResponseData } from "@/components/analytics/response/table/column";
import { db } from "@/lib/db";

/// get all user survey reponses

export const getSurveyResponses = async (userID: string, projectId: string) => {
  try {
    const responses = await db.response.findMany({
      where: {
        type: "SURVEY",
        widget: {
          projectId: projectId,
          project: {
            workspace: {
              memberships: {
                some: {
                  userId: userID,
                },
              },
            },
          },
        },
      },
      include: {
        widget: true, // only include what you need
      },
    });

    const formattedResponse: ResponseData[] = responses.map((res) => {
      const content =
        typeof res.content === "string" ? JSON.parse(res.content) : res.content;
      let rating;
      if (res.surveyType == "NPS") {
        rating = content?.npsScore;
      } else if (res.surveyType == "CSAT") {
        rating = content?.csatScore;
      } else if (res.surveyType == "CUSTOM") {
        rating = null;
      }

      let username = "anonymous";

      if (content?.name) {
        username = content.name;
      }

      return {
        id: res.widgetId,
        widgetName: res.widget.title,
        date: res.createdAt.toLocaleString(),
        user: username,
        summary: String(rating),
      };
    });
    console.log("d5" + JSON.stringify(formattedResponse));
    return formattedResponse;
  } catch (error) {
    console.log(error);
    return { error: "Failed to fetch responses" };
  }
};
