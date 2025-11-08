import { DataTable } from "./data-table";
import { columns, ResponseData } from "./column";
import { getSurveyResponses } from "@/actions/response";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

export default async function AnalyticalTable() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const id = session.user.id;
  const cookieStore = await cookies();
  const projectId = cookieStore.get("currentProjectId")?.value;

  if (!projectId) {
    return;
  }

  const responses = await getSurveyResponses(id, projectId);

  if (!Array.isArray(responses)) {
    console.log(responses.error);
    return <div>Failed to load reponses</div>;
  }

  return (
    <div className="mt-5">
      <DataTable columns={columns} data={responses} />
    </div>
  );
}
