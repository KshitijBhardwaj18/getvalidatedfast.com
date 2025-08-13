import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./zod/schema";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserById } from "./data/user";
import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";



export default {
  pages : {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  events : {
    async linkAccount({user}) {
      await db.user.update({
        where: {
          id : user.id
        },
        data : {
          emailVerified: new Date()
        }
      })
    }
  },
  providers: [
    GitHub(
        {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }
    ),

    Google(
      {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
  ),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;
          console.log("Reached here")
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
          console.log("Reached here")
        }
        
        return null;
      },
    }),
  ],

  
} satisfies NextAuthConfig;
