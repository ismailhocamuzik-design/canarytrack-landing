"use server";

import { EarlyAccessRole } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { createSuccessUrl } from "../../lib/early-access/share";
import { recalculateEarlyAccessWaitlistRanks } from "../../lib/early-access/ranking";

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

function normalizeEmail(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizeCountryCode(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeRole(value: FormDataEntryValue | null): EarlyAccessRole {
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

function createUsernameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "guest";
  const cleaned = localPart.replace(/[^a-zA-Z0-9._-]/g, " ").trim();

  if (cleaned.length > 0) {
    return cleaned.slice(0, 40);
  }

  return "guest";
}

export async function createEarlyAccess(formData: FormData) {
  const email = normalizeEmail(formData.get("email"));
  const usernameInput = normalizeText(formData.get("username"));
  const countryCodeInput = normalizeCountryCode(formData.get("countryCode"));
  const role = normalizeRole(formData.get("role"));
  const referredByCodeInput = normalizeText(formData.get("ref")).toUpperCase();

  if (!email) {
    throw new Error("E-posta zorunludur.");
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
    return {
      ok: true,
      redirectTo: createSuccessUrl(existing.referralCode),
    };
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

  return {
    ok: true,
    redirectTo: createSuccessUrl(referralCode),
  };
}