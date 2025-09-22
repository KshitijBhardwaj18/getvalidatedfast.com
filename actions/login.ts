"use server";

import * as z from "zod";
import { LoginSchema } from "@/zod/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/token";
import { sendTwoFactorToken, sendVerificationToken } from "@/lib/mail";
import { getTwoFacotorVerificationTokenByEmail } from "@/data/two-factor-token";
import { DevBundlerService } from "next/dist/server/lib/dev-bundler-service";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const Login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    console.log("Invalid firlds in Login action");
    return { error: "Invalid Fields" };
  }

  const { email, password, otp } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid Credentials" };
  }

  if (!existingUser.emailVerified) {
    const verficationToken = await generateVerificationToken(email);
    await sendVerificationToken(verficationToken.email, verficationToken.token);
    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (otp) {
      const twoFactorToken = await getTwoFacotorVerificationTokenByEmail(
        existingUser.email
      );

      if (!twoFactorToken) {
        return { error: "Invalid Code!" };
      }

      if (otp !== twoFactorToken?.token) {
        return { error: "Invalid Code" };
      }

      const expired = new Date() > new Date(twoFactorToken.expires);

      if (expired) {
        return { error: "Code Expired" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingUser.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const TwoFaCode = await generateTwoFactorToken(existingUser.email);
      const sent = await sendTwoFactorToken(
        existingUser.email,
        TwoFaCode.token
      );

      console.log({ "email Sent": sent });

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
