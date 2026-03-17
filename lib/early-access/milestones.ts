import { EarlyAccessRole } from "@prisma/client";

export type ReferralMilestoneKey =
  | "starter"
  | "early_access"
  | "priority_boost"
  | "vip_access"
  | "legend";

export type ReferralMilestone = {
  key: ReferralMilestoneKey;
  minReferrals: number;
  title: string;
  shortTitle: string;
  description: string;
  badge: string;
  highlightClassName: string;
};

export type ReferralProgress = {
  referralCount: number;
  current: ReferralMilestone;
  next: ReferralMilestone | null;
  progressPercent: number;
  remainingToNext: number;
  unlockedMilestones: ReferralMilestone[];
};

export const REFERRAL_MILESTONES: ReferralMilestone[] = [
  {
    key: "starter",
    minReferrals: 0,
    title: "Starter",
    shortTitle: "Starter",
    description: "Waitlist’e katıldın. İlk referral ile momentum başlar.",
    badge: "Seed",
    highlightClassName: "border-slate-200 bg-slate-50 text-slate-800",
  },
  {
    key: "early_access",
    minReferrals: 1,
    title: "Early Access Unlock",
    shortTitle: "Early Access",
    description: "İlk referral tamamlandı. Erken erişim avantajı açıldı.",
    badge: "Launch",
    highlightClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    key: "priority_boost",
    minReferrals: 3,
    title: "Priority Boost",
    shortTitle: "Priority",
    description: "3 referral ile bekleme listesinde güçlü bir ivme yakalandı.",
    badge: "Boost",
    highlightClassName: "border-sky-200 bg-sky-50 text-sky-800",
  },
  {
    key: "vip_access",
    minReferrals: 5,
    title: "VIP Access",
    shortTitle: "VIP",
    description: "5 referral ile VIP erişim seviyesine ulaşıldı.",
    badge: "VIP",
    highlightClassName: "border-violet-200 bg-violet-50 text-violet-800",
  },
  {
    key: "legend",
    minReferrals: 10,
    title: "Legend Referrer",
    shortTitle: "Legend",
    description: "10+ referral ile topluluk lideri seviyesine çıkıldı.",
    badge: "Legend",
    highlightClassName: "border-amber-200 bg-amber-50 text-amber-800",
  },
];

export function getRoleLabel(role: EarlyAccessRole) {
  switch (role) {
    case EarlyAccessRole.breeder:
      return "Breeder";
    case EarlyAccessRole.association_leader:
      return "Association Leader";
    case EarlyAccessRole.federation_representative:
      return "Federation Representative";
    case EarlyAccessRole.veterinarian:
      return "Veterinarian";
    case EarlyAccessRole.enthusiast:
      return "Enthusiast";
    default:
      return role;
  }
}

export function getMilestoneByReferralCount(
  referralCount: number,
): ReferralMilestone {
  const normalizedCount = Math.max(0, referralCount);

  let current = REFERRAL_MILESTONES[0];

  for (const milestone of REFERRAL_MILESTONES) {
    if (normalizedCount >= milestone.minReferrals) {
      current = milestone;
    }
  }

  return current;
}

export function getNextMilestone(
  referralCount: number,
): ReferralMilestone | null {
  const normalizedCount = Math.max(0, referralCount);

  return (
    REFERRAL_MILESTONES.find(
      (milestone) => milestone.minReferrals > normalizedCount,
    ) ?? null
  );
}

export function getReferralProgress(
  referralCount: number,
): ReferralProgress {
  const normalizedCount = Math.max(0, referralCount);
  const current = getMilestoneByReferralCount(normalizedCount);
  const next = getNextMilestone(normalizedCount);
  const unlockedMilestones = REFERRAL_MILESTONES.filter(
    (milestone) => milestone.minReferrals <= normalizedCount,
  );

  if (!next) {
    return {
      referralCount: normalizedCount,
      current,
      next: null,
      progressPercent: 100,
      remainingToNext: 0,
      unlockedMilestones,
    };
  }

  const currentFloor = current.minReferrals;
  const nextFloor = next.minReferrals;
  const range = Math.max(1, nextFloor - currentFloor);
  const position = normalizedCount - currentFloor;
  const progressPercent = Math.min(
    100,
    Math.max(0, (position / range) * 100),
  );

  return {
    referralCount: normalizedCount,
    current,
    next,
    progressPercent,
    remainingToNext: Math.max(0, nextFloor - normalizedCount),
    unlockedMilestones,
  };
}

export function getRankBoost(referralCount: number) {
  const normalizedCount = Math.max(0, referralCount);

  if (normalizedCount >= 10) {
    return 40;
  }

  if (normalizedCount >= 5) {
    return 20;
  }

  if (normalizedCount >= 3) {
    return 10;
  }

  if (normalizedCount >= 1) {
    return 3;
  }

  return 0;
}

export function getTopSegmentSummary(input: {
  countryCode: string;
  count: number;
  totalUsers: number;
}) {
  const percent =
    input.totalUsers > 0 ? (input.count / input.totalUsers) * 100 : 0;

  return {
    label: input.countryCode,
    count: input.count,
    percent,
  };
}