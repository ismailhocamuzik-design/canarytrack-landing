import { EarlyAccessRole, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getReferralProgress } from "../../../../lib/early-access/milestones";
import { getBoostScore, getRankingScore } from "../../../../lib/early-access/ranking";

const roleOptions = [
  EarlyAccessRole.breeder,
  EarlyAccessRole.association_leader,
  EarlyAccessRole.federation_representative,
  EarlyAccessRole.veterinarian,
  EarlyAccessRole.enthusiast,
] as const;

function buildWhere(
  role?: string,
  country?: string,
): Prisma.EarlyAccessWhereInput {
  const where: Prisma.EarlyAccessWhereInput = {};

  if (role && roleOptions.includes(role as EarlyAccessRole)) {
    where.role = role as EarlyAccessRole;
  }

  if (country && country.trim() !== "") {
    where.countryCode = country.trim().toUpperCase();
  }

  return where;
}

function escapeCsvValue(value: string | number | null | undefined) {
  const raw = value == null ? "" : String(value);
  const escaped = raw.replace(/"/g, "\"\"");

  return `"${escaped}"`;
}

function createFilename(role?: string, country?: string) {
  const parts = ["waitlist"];

  if (role) {
    parts.push(role);
  }

  if (country) {
    parts.push(country.toUpperCase());
  }

  parts.push(new Date().toISOString().slice(0, 10));

  return `${parts.join("-")}.csv`;
}

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") ?? "";
  const country = request.nextUrl.searchParams.get("country") ?? "";

  const where = buildWhere(role, country);

  const rows = await prisma.earlyAccess.findMany({
    where,
    include: {
      referredBy: {
        select: {
          username: true,
          email: true,
          referralCode: true,
        },
      },
      _count: {
        select: {
          referrals: true,
        },
      },
    },
    orderBy: [
      { waitlistRank: "asc" },
      { createdAt: "asc" },
    ],
  });

  const header = [
    "id",
    "waitlistRank",
    "username",
    "email",
    "countryCode",
    "role",
    "referralCode",
    "referralCount",
    "actualReferralCount",
    "boostScore",
    "rankingScore",
    "milestone",
    "referredByCode",
    "referredByUsername",
    "referredByEmail",
    "createdAt",
    "updatedAt",
  ];

  const csvLines = [
    header.map((cell) => escapeCsvValue(cell)).join(","),
    ...rows.map((row) => {
      const boostScore = getBoostScore(row.referralCount);
      const rankingScore = getRankingScore(row.referralCount);
      const progress = getReferralProgress(row.referralCount);

      return [
        row.id,
        row.waitlistRank ?? "",
        row.username,
        row.email,
        row.countryCode,
        row.role,
        row.referralCode,
        row.referralCount,
        row._count.referrals,
        boostScore,
        rankingScore,
        progress.current.shortTitle,
        row.referredByCode ?? "",
        row.referredBy?.username ?? "",
        row.referredBy?.email ?? "",
        row.createdAt.toISOString(),
        row.updatedAt.toISOString(),
      ]
        .map((cell) => escapeCsvValue(cell))
        .join(",");
    }),
  ];

  const csv = csvLines.join("\n");
  const filename = createFilename(role, country);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}