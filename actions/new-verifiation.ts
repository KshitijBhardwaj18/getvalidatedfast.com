"use server";

import { db } from "@/lib/db";
import { getUserByEmail, getVerifiactionTokenByToken } from "@/data/user";

export const VerifyEmail = async (token: string) => {
  console.log("exisitingToken");
  const exisitingToken = await getVerifiactionTokenByToken(token);

  if (!exisitingToken) {
    return { error: "Link not valid" };
  }

  const existingUser = await getUserByEmail(exisitingToken.email);

  if (!existingUser) {
    return { error: "Invalid User" };
  }

  if (existingUser.emailVerified) {
    return { error: "Already Verified" };
  }

  const isExpired = exisitingToken.expires < new Date();

  if (isExpired) {
    return { error: "Token has expired" };
  }

  await db.user.update({
    where: {
      email: exisitingToken.email,
    },
    data: {
      emailVerified: new Date(),
      email: exisitingToken.email,
    },
  });

  await db.verifiactionToken.delete({
    where: {
      id: exisitingToken.id,
    },
  });

  return { success: "Email is verfied" };
};
