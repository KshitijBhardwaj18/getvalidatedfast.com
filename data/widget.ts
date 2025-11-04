import { db } from "@/lib/db";

export const getWidgetDetails = async (id: string) => {
  try {
    const widget = await db.widget.findUnique({
      where: { id },
    });

    console.log(widget)

    return widget;
  } catch (error) {
    console.log(error);
    return null;
  }
};
