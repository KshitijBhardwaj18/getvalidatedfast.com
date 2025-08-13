import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { getVerifiactionTokenByEmail } from "@/data/user";
import crypto from "crypto";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 900 * 1000);

  const existingToken = await getVerifiactionTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const Twofa = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return Twofa;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();

  const existingToken = await getVerifiactionTokenByEmail(email);

  if (existingToken) {
    await db.verifiactionToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const createdToken = await db.verifiactionToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return createdToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    const generatedToken = await db.resetPasswordToken.create({
      data: {
        email,
        token,
        expires: new Date(new Date().getTime() + 3600 * 1000),
      },
    });

    return generatedToken;
  } catch (error) {
    console.log(error);
  }
};
