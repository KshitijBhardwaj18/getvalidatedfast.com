"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import * as z from "zod";

const OnboardingPayload = z.object({
  teamName: z.string().min(1, "Team name is required").max(50),
  projectName: z.string().min(1, "Project name is required").max(50),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generateUniqueWorkspaceSlug(base: string) {
  let candidate = slugify(base);
  let suffix = 1;

  // Ensure uniqueness
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.workspace.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

export type CreateOnboardingResult =
  | { success: true; workspaceId: string; projectId: string }
  | { success: false; error: string };

export async function createWorkspaceAndProject(
  values: z.infer<typeof OnboardingPayload>
): Promise<CreateOnboardingResult> {
  const session = await auth();
  const userId = session?.user?.id;``

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = OnboardingPayload.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: "Invalid data" };
  }

  const { teamName, projectName } = parsed.data;

  try {
    const slug = await generateUniqueWorkspaceSlug(teamName);

    const result = await db.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: { name: teamName, slug },
      });

      await tx.membership.create({
        data: {
          userId,
          workspaceId: workspace.id,
          // role defaults to OWNER per schema
        },
      });

      const project = await tx.project.create({
        data: {
          name: projectName,
          workspaceId: workspace.id,
        },
      });

      return { workspaceId: workspace.id, projectId: project.id };
    });

    return { success: true, ...result };
  } catch (error) {
    console.error("Onboarding creation failed", error);
    return { success: false, error: "Failed to create workspace/project" };
  }
}


