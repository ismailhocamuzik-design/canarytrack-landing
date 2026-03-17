import { prisma } from "../prisma";
import { getRankBoost } from "./milestones";

export type EarlyAccessRankingInput = {
  id: string;
  referralCount: number;
  createdAt: Date;
};

export type EarlyAccessRankingResult = {
  id: string;
  referralCount: number;
  boostScore: number;
  rankingScore: number;
  createdAt: Date;
  waitlistRank: number;
};

export function getBoostScore(referralCount: number) {
  return getRankBoost(referralCount);
}

export function getRankingScore(referralCount: number) {
  const normalizedReferralCount = Math.max(0, referralCount);
  const rawReferralScore = normalizedReferralCount * 100;
  const boostScore = getBoostScore(normalizedReferralCount);

  return rawReferralScore + boostScore;
}

export function buildRankedWaitlist(
  entries: EarlyAccessRankingInput[],
): EarlyAccessRankingResult[] {
  return [...entries]
    .map((entry) => ({
      id: entry.id,
      referralCount: entry.referralCount,
      boostScore: getBoostScore(entry.referralCount),
      rankingScore: getRankingScore(entry.referralCount),
      createdAt: entry.createdAt,
      waitlistRank: 0,
    }))
    .sort((a, b) => {
      if (b.rankingScore !== a.rankingScore) {
        return b.rankingScore - a.rankingScore;
      }

      if (b.referralCount !== a.referralCount) {
        return b.referralCount - a.referralCount;
      }

      if (a.createdAt.getTime() !== b.createdAt.getTime()) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }

      return a.id.localeCompare(b.id);
    })
    .map((entry, index) => ({
      ...entry,
      waitlistRank: index + 1,
    }));
}

export async function recalculateEarlyAccessWaitlistRanks() {
  const entries = await prisma.earlyAccess.findMany({
    select: {
      id: true,
      referralCount: true,
      createdAt: true,
    },
  });

  const rankedEntries = buildRankedWaitlist(entries);

  await prisma.$transaction(
    rankedEntries.map((entry) =>
      prisma.earlyAccess.update({
        where: {
          id: entry.id,
        },
        data: {
          waitlistRank: entry.waitlistRank,
        },
      }),
    ),
  );

  return rankedEntries;
}