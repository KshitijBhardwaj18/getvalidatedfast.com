"use server"

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginViaProvider = async (provider: string) => {
  await signIn(provider);
};
