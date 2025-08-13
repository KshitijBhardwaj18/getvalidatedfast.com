"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/zod/schema";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationToken } from "@/lib/mail";

export const SignUp = async (values: z.infer<typeof SignUpSchema>) => {
  console.log(values);
  const validatedValues = SignUpSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Invalid Fields" };
  }

  const { name, email, password } = validatedValues.data;

  const user = await getUserByEmail(email);

  if (user) {
    return { error: "user already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verifiactionToken = await generateVerificationToken(email);
  await sendVerificationToken(verifiactionToken.email, verifiactionToken.token);

  return { success: "User created successfully" };
};
