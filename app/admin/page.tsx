import Link from "next/link";
import type { ReactNode } from "react";
import { prisma } from "../../lib/prisma";
import {
  REFERRAL_MILESTONES,
  getRankBoost,
  getReferralProgress,
  getRoleLabel,
  getTopSegmentSummary,
} from "../../lib/early-access/milestones";

export const dynamic = "force-dynamic";

function getStartOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getStartOfWeek() {
  const today = getStartOfToday();
  const day = today.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(today);

  start.setDate(today.getDate() - diff);

  return start;
}

function getLastNDaysStart(days: number) {
  const today = getStartOfToday();
  const start = new Date(today);

  start.setDate(today.getDate() - (days - 1));

  return start;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number) {
  return `${formatDecimal(value)}%`;
}

type SummaryCardProps = {
  title: string;
  value: string | number;
  description: string;
};

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

type InsightCardProps = {
  title: string;
  value: string | number;
  description: string;
};

function InsightCard({ title, value, description }: InsightCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
};

function Section({ title, description, action, children }: SectionProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      <div className="p-6">{children}</div>
    </div>
  );
}

type DistributionProps = {
  title: string;
  description: string;
  data: Array<{
    label: string;
    value: number;
    percent: number;
  }>;
};

function Distribution({ title, description, data }: DistributionProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="mt-5 space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-slate-500">Veri bulunmuyor.</p>
        ) : (
          data.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{item.label}</span>
                <span className="font-semibold text-slate-900">
                  {item.value} ({formatPercent(item.percent)})
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{ width: `${Math.min(100, item.percent)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const startOfToday = getStartOfToday();
  const startOfWeek = getStartOfWeek();
  const last7DaysStart = getLastNDaysStart(7);

  const [
    totalUsers,
    todaySignups,
    weekSignups,
    referralAggregate,
    topReferrers,
    countryDistribution,
    roleDistribution,
    recentEntries,
    last7DaysEntries,
    directSignups,
    referredSignups,
    milestoneCounts,
  ] = await Promise.all([
    prisma.earlyAccess.count(),
    prisma.earlyAccess.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    }),
    prisma.earlyAccess.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    }),
    prisma.earlyAccess.aggregate({
      _sum: {
        referralCount: true,
      },
    }),
    prisma.earlyAccess.findMany({
      take: 8,
      orderBy: [
        {
          referralCount: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
      select: {
        id: true,
        username: true,
        email: true,
        countryCode: true,
        role: true,
        referralCode: true,
        referralCount: true,
        waitlistRank: true,
        createdAt: true,
        _count: {
          select: {
            referrals: true,
          },
        },
      },
    }),
    prisma.earlyAccess.groupBy({
      by: ["countryCode"],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          countryCode: "desc",
        },
      },
      take: 8,
    }),
    prisma.earlyAccess.groupBy({
      by: ["role"],
      _count: {
        _all: true,
      },
      orderBy: {
        _count: {
          role: "desc",
        },
      },
    }),
    prisma.earlyAccess.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        email: true,
        countryCode: true,
        role: true,
        referralCode: true,
        waitlistRank: true,
        createdAt: true,
        referralCount: true,
      },
    }),
    prisma.earlyAccess.findMany({
      where: {
        createdAt: {
          gte: last7DaysStart,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.earlyAccess.count({
      where: {
        referredByCode: null,
      },
    }),
    prisma.earlyAccess.count({
      where: {
        referredByCode: {
          not: null,
        },
      },
    }),
    Promise.all(
      REFERRAL_MILESTONES.map(async (milestone, index) => {
        const nextMilestone = REFERRAL_MILESTONES[index + 1];

        const count = await prisma.earlyAccess.count({
          where: nextMilestone
            ? {
                referralCount: {
                  gte: milestone.minReferrals,
                  lt: nextMilestone.minReferrals,
                },
              }
            : {
                referralCount: {
                  gte: milestone.minReferrals,
                },
              },
        });

        return {
          milestone,
          count,
        };
      }),
    ),
  ]);

  const totalReferrals = referralAggregate._sum.referralCount ?? 0;
  const averageReferralPerUser =
    totalUsers > 0 ? totalReferrals / totalUsers : 0;

  const referralAdoptionRate =
    totalUsers > 0 ? (referredSignups / totalUsers) * 100 : 0;

  const topCountryRaw = countryDistribution[0];
  const topCountry = topCountryRaw
    ? getTopSegmentSummary({
        countryCode: topCountryRaw.countryCode,
        count: topCountryRaw._count._all,
        totalUsers,
      })
    : null;

  const topRoleRaw = roleDistribution[0];
  const topRole = topRoleRaw
    ? {
        label: getRoleLabel(topRoleRaw.role),
        count: topRoleRaw._count._all,
        percent:
          totalUsers > 0 ? (topRoleRaw._count._all / totalUsers) * 100 : 0,
      }
    : null;

  const growthMap = new Map<string, number>();

  for (let i = 0; i < 7; i += 1) {
    const day = new Date(last7DaysStart);
    day.setDate(last7DaysStart.getDate() + i);

    const key = day.toISOString().slice(0, 10);
    growthMap.set(key, 0);
  }

  for (const entry of last7DaysEntries) {
    const keyDate = new Date(entry.createdAt);
    const normalized = new Date(
      keyDate.getFullYear(),
      keyDate.getMonth(),
      keyDate.getDate(),
    );
    const key = normalized.toISOString().slice(0, 10);

    growthMap.set(key, (growthMap.get(key) ?? 0) + 1);
  }

  const growthItems = Array.from(growthMap.entries()).map(([key, count]) => ({
    key,
    count,
    date: new Date(key),
  }));

  const maxGrowthCount = growthItems.reduce(
    (max, item) => Math.max(max, item.count),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              CanaryTrack Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Growth Dashboard
            </h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Early access büyümesini, referral milestone yapısını, conversion
              davranışını ve en güçlü segmentleri tek ekranda takip et.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/waitlist"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Waitlist Management
            </Link>

            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Public Leaderboard
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Users"
          value={totalUsers}
          description="Waitlist içindeki toplam kayıt"
        />
        <SummaryCard
          title="Today Signups"
          value={todaySignups}
          description="Bugün eklenen başvurular"
        />
        <SummaryCard
          title="This Week"
          value={weekSignups}
          description="Bu hafta gelen başvurular"
        />
        <SummaryCard
          title="Total Referrals"
          value={totalReferrals}
          description="Sistem genelindeki toplam referral puanı"
        />
        <SummaryCard
          title="Avg Referral/User"
          value={formatDecimal(averageReferralPerUser)}
          description="Kullanıcı başına ortalama referral"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InsightCard
          title="Direct Signups"
          value={directSignups}
          description="Referral kodu olmadan gelen kullanıcılar"
        />
        <InsightCard
          title="Referred Signups"
          value={referredSignups}
          description="Başka bir kullanıcı üzerinden gelen kayıtlar"
        />
        <InsightCard
          title="Referral Adoption"
          value={formatPercent(referralAdoptionRate)}
          description="Referral ile gelen kullanıcı oranı"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Section
          title="Milestone Funnel"
          description="Referral sayısına göre kullanıcıların bulunduğu seviye dağılımı"
        >
          <div className="space-y-4">
            {milestoneCounts.map(({ milestone, count }) => {
              const percent = totalUsers > 0 ? (count / totalUsers) * 100 : 0;

              return (
                <div
                  key={milestone.key}
                  className={`rounded-2xl border px-4 py-4 ${milestone.highlightClassName}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em]">
                          {milestone.badge}
                        </span>
                        <span className="text-sm font-semibold">
                          {milestone.title}
                        </span>
                      </div>

                      <p className="mt-2 text-sm opacity-90">
                        {milestone.description}
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs font-medium opacity-80">
                        {formatPercent(percent)} of users
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          title="Growth Signals"
          description="Şu an en değerli conversion ve segment içgörüleri"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Top Country
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {topCountry ? topCountry.label : "-"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {topCountry
                  ? `${topCountry.count} kullanıcı · ${formatPercent(topCountry.percent)} pay`
                  : "Henüz veri yok"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Top Role
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {topRole ? topRole.label : "-"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {topRole
                  ? `${topRole.count} kullanıcı · ${formatPercent(topRole.percent)} pay`
                  : "Henüz veri yok"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Viral Momentum
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {referredSignups > directSignups ? "Strong" : "Building"}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {referredSignups > directSignups
                  ? "Referral kaynaklı büyüme direct signup’ı geçmiş durumda."
                  : "Referral büyümesi devam ediyor, ancak direct signup hâlâ baskın."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Rank Boost Logic
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                1 referral = +3 boost · 3 referral = +10 boost · 5 referral =
                +20 boost · 10+ referral = +40 boost
              </p>
            </div>
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Section
          title="Top Referrers"
          description="En çok kullanıcı getiren başvurular ve aktif milestone durumları"
          action={
            <Link
              href="/admin/waitlist"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Tüm waitlist →
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Country
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Milestone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Referrals
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Detail
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {topReferrers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      Henüz kayıt bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  topReferrers.map((entry, index) => {
                    const progress = getReferralProgress(entry.referralCount);
                    const boost = getRankBoost(entry.referralCount);

                    return (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {index === 0 ? "🏆 " : ""}
                              {entry.username}
                            </span>
                            <span className="text-sm text-slate-500">
                              {entry.email}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                          {getRoleLabel(entry.role)}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                          {entry.countryCode}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <span
                              className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${progress.current.highlightClassName}`}
                            >
                              {progress.current.shortTitle}
                            </span>

                            <span className="text-xs text-slate-500">
                              Boost score: +{boost}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {entry.referralCount}
                            </span>
                            <span className="text-xs text-slate-500">
                              actual referrals: {entry._count.referrals}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-right">
                          <Link
                            href={`/admin/waitlist/referral/${entry.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="Last 7 Days Growth"
          description="Günlük signup hareketi"
        >
          <div className="space-y-4">
            {growthItems.map((item) => {
              const width =
                maxGrowthCount > 0
                  ? Math.max(8, Math.round((item.count / maxGrowthCount) * 100))
                  : 8;

              return (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      {formatDayLabel(item.date)}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Distribution
          title="Country Distribution"
          description="En çok başvuru gelen ülkeler"
          data={countryDistribution.map((item) => ({
            label: item.countryCode,
            value: item._count._all,
            percent: totalUsers > 0 ? (item._count._all / totalUsers) * 100 : 0,
          }))}
        />

        <Distribution
          title="Role Distribution"
          description="Başvuran profillerin dağılımı"
          data={roleDistribution.map((item) => ({
            label: getRoleLabel(item.role),
            value: item._count._all,
            percent: totalUsers > 0 ? (item._count._all / totalUsers) * 100 : 0,
          }))}
        />
      </div>

      <Section
        title="Recent Signups"
        description="Sisteme en son katılan başvurular ve milestone hedef ilerlemesi"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Milestone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Detail
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    Henüz kayıt bulunmuyor.
                  </td>
                </tr>
              ) : (
                recentEntries.map((entry) => {
                  const progress = getReferralProgress(entry.referralCount);

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {entry.username}
                          </span>
                          <span className="text-sm text-slate-500">
                            {entry.email}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                        {getRoleLabel(entry.role)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                        {entry.countryCode}
                      </td>

                      <td className="px-4 py-4">
                        <div className="max-w-[220px] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${progress.current.highlightClassName}`}
                            >
                              {progress.current.shortTitle}
                            </span>

                            <span className="text-xs text-slate-500">
                              {entry.referralCount} ref
                            </span>
                          </div>

                          {progress.next ? (
                            <>
                              <div className="h-2 rounded-full bg-slate-100">
                                <div
                                  className="h-2 rounded-full bg-emerald-500"
                                  style={{
                                    width: `${Math.max(
                                      6,
                                      progress.progressPercent,
                                    )}%`,
                                  }}
                                />
                              </div>

                              <p className="text-xs text-slate-500">
                                {progress.remainingToNext} referral sonra{" "}
                                {progress.next.shortTitle}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-slate-500">
                              Tüm milestone seviyeleri açıldı.
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
                        {formatDateTime(entry.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right">
                        <Link
                          href={`/admin/waitlist/referral/${entry.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}