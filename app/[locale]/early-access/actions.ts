"use server";

import { EarlyAccessRole, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import {
  getEarlyAccessByEmail,
  recalculateEarlyAccessRanks,
} from "../../../lib/early-access/waitlist";
import {
  earlyAccessSchema,
  type EarlyAccessActionState,
} from "./validation";

function createReferralCode(email: string) {
  const base = email
    .split("@")[0]
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);

  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `${base}${randomPart}`;
}

async function generateUniqueReferralCode(email: string) {
  for (let i = 0; i < 10; i += 1) {
    const code = createReferralCode(email);

    const existing = await prisma.earlyAccess.findUnique({
      where: {
        referralCode: code,
      },
      select: {
        id: true,
      },
    });

    if (!existing) {
      return code;
    }
  }

  return `CANARY${Date.now().toString().slice(-6)}`;
}

function buildReferralLink(
  siteUrl: string | undefined,
  locale: string,
  referralCode: string,
) {
  const baseUrl = (
    siteUrl ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return `${baseUrl}/${locale}?ref=${referralCode}`;
}

export async function submitEarlyAccess(
  prevState: EarlyAccessActionState,
  formData: FormData,
): Promise<EarlyAccessActionState> {
  void prevState;

  const rawData = {
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    countryCode: String(formData.get("countryCode") ?? ""),
    role: String(formData.get("role") ?? ""),
    referralCode: String(formData.get("referralCode") ?? ""),
  };

  const locale = String(formData.get("locale") ?? "en");
  const siteUrl = String(formData.get("siteUrl") ?? "");

  const parsed = earlyAccessSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message:
        locale === "tr"
          ? "Form alanlarını kontrol edin."
          : "Please check the form fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      referralCode: undefined,
      referralLink: undefined,
      waitlistRank: null,
      referralCount: 0,
    };
  }

  const { username, email, countryCode, role, referralCode } = parsed.data;

  try {
    const existingUser = await getEarlyAccessByEmail(email);

    if (existingUser) {
      const safeReferralCode = existingUser.referralCode ?? undefined;

      return {
        success: true,
        message:
          locale === "tr"
            ? "Bu e-posta zaten kayıtlı."
            : "This email is already registered.",
        referralCode: safeReferralCode,
        referralLink: safeReferralCode
          ? buildReferralLink(siteUrl, locale, safeReferralCode)
          : undefined,
        waitlistRank: existingUser.waitlistRank ?? null,
        referralCount: existingUser.referralCount ?? 0,
      };
    }

    let referredByCode: string | null = null;

    if (referralCode) {
      const referrer = await prisma.earlyAccess.findUnique({
        where: {
          referralCode,
        },
        select: {
          referralCode: true,
        },
      });

      if (referrer?.referralCode) {
        referredByCode = referrer.referralCode;
      }
    }

    const newReferralCode = await generateUniqueReferralCode(email);

    await prisma.$transaction(async (tx) => {
      await tx.earlyAccess.create({
        data: {
          username,
          email,
          countryCode,
          role: role as EarlyAccessRole,
          referralCode: newReferralCode,
          referredByCode,
        },
      });

      if (referredByCode) {
        await tx.earlyAccess.update({
          where: {
            referralCode: referredByCode,
          },
          data: {
            referralCount: {
              increment: 1,
            },
          },
        });
      }
    });

    await recalculateEarlyAccessRanks();

    const createdUser = await getEarlyAccessByEmail(email);

    return {
      success: true,
      message:
        locale === "tr"
          ? "Kaydınız başarıyla alındı."
          : "Your registration has been received successfully.",
      referralCode: createdUser?.referralCode ?? newReferralCode,
      referralLink: buildReferralLink(
        siteUrl,
        locale,
        createdUser?.referralCode ?? newReferralCode,
      ),
      waitlistRank: createdUser?.waitlistRank ?? null,
      referralCount: createdUser?.referralCount ?? 0,
    };
  } catch (error) {
    console.error("EARLY_ACCESS_ERROR:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingUser = await getEarlyAccessByEmail(email);
      const safeReferralCode = existingUser?.referralCode ?? undefined;

      return {
        success: true,
        message:
          locale === "tr"
            ? "Bu e-posta zaten kayıtlı."
            : "This email is already registered.",
        referralCode: safeReferralCode,
        referralLink: safeReferralCode
          ? buildReferralLink(siteUrl, locale, safeReferralCode)
          : undefined,
        waitlistRank: existingUser?.waitlistRank ?? null,
        referralCount: existingUser?.referralCount ?? 0,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message:
          locale === "tr"
            ? `Kayıt sırasında hata oluştu: ${error.message}`
            : `Registration error: ${error.message}`,
        referralCode: undefined,
        referralLink: undefined,
        waitlistRank: null,
        referralCount: 0,
      };
    }

    return {
      success: false,
      message:
        locale === "tr"
          ? "Kayıt sırasında bir hata oluştu."
          : "An error occurred during registration.",
      referralCode: undefined,
      referralLink: undefined,
      waitlistRank: null,
      referralCount: 0,
    };
  }
}