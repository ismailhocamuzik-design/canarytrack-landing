import { NextRequest, NextResponse } from "next/server";
import { EarlyAccessRole } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { recalculateEarlyAccessWaitlistRanks } from "../../../lib/early-access/ranking";

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
  for (let i = 0; i < 20; i += 1) {
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

  throw new Error("Referral code üretilemedi.");
}

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim();
}

function normalizeCountryCode(value: unknown) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeRole(value: unknown): EarlyAccessRole {
  const raw = String(value ?? "").trim();

  if (
    raw === "breeder" ||
    raw === "association_leader" ||
    raw === "federation_representative" ||
    raw === "veterinarian" ||
    raw === "enthusiast"
  ) {
    return raw;
  }

  return "enthusiast";
}

function normalizeLocale(value: unknown) {
  const raw = String(value ?? "").trim().toLowerCase();

  if (raw === "tr" || raw === "en") {
    return raw;
  }

  return "tr";
}

function createUsernameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "guest";
  const cleaned = localPart.replace(/[^a-zA-Z0-9._-]/g, " ").trim();

  if (cleaned.length > 0) {
    return cleaned.slice(0, 40);
  }

  return "guest";
}

function createSuccessPath(locale: string, referralCode: string) {
  const params = new URLSearchParams({
    code: referralCode,
  });

  return `/${locale}/early-access/success?${params.toString()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: string;
      username?: string;
      countryCode?: string;
      role?: string;
      ref?: string;
      locale?: string;
    };

    const email = normalizeEmail(body.email);
    const usernameInput = normalizeText(body.username);
    const countryCodeInput = normalizeCountryCode(body.countryCode);
    const role = normalizeRole(body.role);
    const referredByCodeInput = normalizeText(body.ref).toUpperCase();
    const locale = normalizeLocale(body.locale);

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          message: "E-posta zorunludur.",
        },
        {
          status: 400,
        },
      );
    }

    const username = usernameInput || createUsernameFromEmail(email);
    const countryCode = countryCodeInput || "TR";

    const existing = await prisma.earlyAccess.findUnique({
      where: {
        email,
      },
      select: {
        referralCode: true,
      },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        redirectTo: createSuccessPath(locale, existing.referralCode),
      });
    }

    let referredByCode: string | null = null;

    if (referredByCodeInput) {
      const refOwner = await prisma.earlyAccess.findUnique({
        where: {
          referralCode: referredByCodeInput,
        },
        select: {
          referralCode: true,
        },
      });

      if (refOwner) {
        referredByCode = refOwner.referralCode;
      }
    }

    const referralCode = await generateUniqueReferralCode(email);

    await prisma.$transaction(async (tx) => {
      await tx.earlyAccess.create({
        data: {
          username,
          email,
          countryCode,
          role,
          referralCode,
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

    await recalculateEarlyAccessWaitlistRanks();

    return NextResponse.json({
      ok: true,
      redirectTo: createSuccessPath(locale, referralCode),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Kayıt sırasında beklenmeyen bir hata oluştu.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      {
        status: 500,
      },
    );
  }
}