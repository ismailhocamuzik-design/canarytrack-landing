import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/prisma";
import {
  getReferralProgress,
  getRoleLabel,
} from "../../../../../lib/early-access/milestones";
import {
  getBoostScore,
  getRankingScore,
} from "../../../../../lib/early-access/ranking";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type RoleLabelParam = Parameters<typeof getRoleLabel>[0];

export default async function ReferralDetailPage({ params }: PageProps) {
  const { id } = await params;

  const entry = await prisma.earlyAccess.findUnique({
    where: {
      id,
    },
    include: {
      referredBy: {
        select: {
          id: true,
          username: true,
          email: true,
          referralCode: true,
        },
      },
      referrals: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          username: true,
          email: true,
          countryCode: true,
          role: true,
          createdAt: true,
          referralCode: true,
          waitlistRank: true,
          referralCount: true,
        },
      },
      _count: {
        select: {
          referrals: true,
        },
      },
    },
  });

  if (!entry) {
    notFound();
  }

  const progress = getReferralProgress(entry.referralCount);
  const boostScore = getBoostScore(entry.referralCount);
  const rankingScore = getRankingScore(entry.referralCount);

  const countryDistribution = Array.from(
    entry.referrals.reduce((map, referral) => {
      const key = referral.countryCode;
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<string, number>()),
  ).sort((a, b) => b[1] - a[1]);

  const roleDistribution = Array.from(
    entry.referrals.reduce((map, referral) => {
      const key = referral.role as RoleLabelParam;
      map.set(key, (map.get(key) ?? 0) + 1);
      return map;
    }, new Map<RoleLabelParam, number>()),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/admin/waitlist"
            className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to waitlist
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Referral Detail
          </h1>

          <p className="text-sm text-slate-600">
            {entry.username} kullanıcısının referral performansı, boost durumu ve
            sıralama etkisi burada listelenir.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold">Referral Code:</span>{" "}
          <span className="font-mono">{entry.referralCode}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Final Rank</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {entry.waitlistRank ?? "-"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Raw Referral</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {entry.referralCount}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            actual: {entry._count.referrals}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Boost Score</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-700">
            +{boostScore}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ranking Score</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {rankingScore}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Country</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {entry.countryCode}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Role</p>
          <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
            {getRoleLabel(entry.role as RoleLabelParam)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Applicant Info</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Username
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {entry.username}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Email
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {entry.email}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Joined
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {new Intl.DateTimeFormat("tr-TR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(entry.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Referred By
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {entry.referredBy ? entry.referredBy.username : "Direct signup"}
              </p>
              {entry.referredBy ? (
                <p className="mt-1 text-xs text-slate-500">
                  {entry.referredBy.email} · {entry.referredBy.referralCode}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Milestone Status</h2>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${progress.current.highlightClassName}`}
                >
                  {progress.current.shortTitle}
                </span>

                <span className="text-sm font-semibold text-slate-900">
                  {entry.referralCount} ref
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                {progress.current.description}
              </p>
            </div>

            {progress.next ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Next Unlock
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {progress.next.title}
                </p>

                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.max(6, progress.progressPercent)}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-600">
                  {progress.remainingToNext} referral sonra{" "}
                  {progress.next.shortTitle} açılır.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <p className="text-sm font-semibold">Tüm milestone seviyeleri açık</p>
                <p className="mt-2 text-sm">
                  Bu kullanıcı maksimum boost segmentine ulaşmış durumda.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Final Rank Formula
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {entry.referralCount} × 100 + {boostScore} = {rankingScore}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Country Distribution
          </h2>

          <div className="mt-4 space-y-3">
            {countryDistribution.length === 0 ? (
              <p className="text-sm text-slate-500">
                Henüz referral kaydı yok.
              </p>
            ) : (
              countryDistribution.map(([countryCode, count]) => (
                <div
                  key={countryCode}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {countryCode}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Role Distribution
          </h2>

          <div className="mt-4 space-y-3">
            {roleDistribution.length === 0 ? (
              <p className="text-sm text-slate-500">
                Henüz referral kaydı yok.
              </p>
            ) : (
              roleDistribution.map(([role, count]) => (
                <div
                  key={role}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {getRoleLabel(role)}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Referred Users
          </h2>
          <p className="text-sm text-slate-500">
            Bu kullanıcı tarafından davet edilip kayıt olan kişiler.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1100px] divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Final Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Raw Referral
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {entry.referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Henüz bu referral code ile kayıt olan kullanıcı yok.
                  </td>
                </tr>
              ) : (
                entry.referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {referral.username}
                        </span>
                        <span className="text-sm text-slate-500">
                          {referral.email}
                        </span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {getRoleLabel(referral.role as RoleLabelParam)}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {referral.countryCode}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {referral.waitlistRank ?? "-"}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {referral.referralCount}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {new Intl.DateTimeFormat("tr-TR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(referral.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}