"use server";
import { db } from "@/lib/db";
import { sendResetPasswordToken } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/token";
import { resetPasswordSchema } from "@/zod/schema";
import * as z from "zod";

export const resetPasswordAction = async (
  values: z.infer<typeof resetPasswordSchema>
) => {
  const validatedFields = resetPasswordSchema.safeParse(values);

  if (validatedFields.error) {
    return { error: "Invalid fields" };
  }

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (!existingUser) {
      return { error: "No such user exists" };
    }

    const resetToken = await generatePasswordResetToken(values.email);

    if (!resetToken) {
      return { error: "Server error" };
    }
    const { token, email } = resetToken;

    const Emailsent = await sendResetPasswordToken(email, token);

    if(Emailsent){
        return {success : "Reset Password email sent"}
    }
  } catch (error) {
    console.log(error);
    return { error: "Server error" };
  }
};
