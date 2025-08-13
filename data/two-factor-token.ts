import { db } from "@/lib/db";

export const getTwoFacotorVerificationTokenByEmail = async (email: string) => {
  try {
    const TwoFA = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return TwoFA;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTwoFacotorVerificationTokenByToken = async (token: string) => {
  try {
    const TwoFA = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return TwoFA;
  } catch (error) {
    console.log(error);
    return null;
  }
};
