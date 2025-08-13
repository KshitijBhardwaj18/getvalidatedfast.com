"use server";

import { getPasswordVerificationToken } from "@/data/user";
import { db } from "@/lib/db";
import { newPasswordSchema } from "@/zod/schema";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const UpdatePassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token: string | null
) => {
  if (!token) {
    return { error: "Invalid Link" };
  }
  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields) {
    return { error: "Invalid Fields" };
  }

  const { password } = values;

  const hashedPassword = await bcrypt.hash(password, 10);

  const Token = await getPasswordVerificationToken(token);
  console.log(Token);
  if (!Token) {
    return { error: "Invalid Link" };
  }
  const { email } = Token;

  console.log(email);

  const updatedPassword = await db.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  const tokenDeleted = await db.resetPasswordToken.delete({
    where: {
      id: Token.id,
    },
  });

  if (updatedPassword == null) {
    return { error: "Invalid credentials" };
  } else {
    return { success: "Password updated" };
  }
};
