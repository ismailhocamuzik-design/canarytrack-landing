import Link from "next/link";
import { prisma } from "../../lib/prisma";
import {
  getReferralProgress,
  getRoleLabel,
} from "../../lib/early-access/milestones";
import { getBoostScore, getRankingScore } from "../../lib/early-access/ranking";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getPodiumCardClassName(position: number) {
  if (position === 1) {
    return "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-yellow-50";
  }

  if (position === 2) {
    return "border-slate-300 bg-gradient-to-br from-slate-50 via-white to-slate-100";
  }

  return "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50";
}

function getPodiumBadge(position: number) {
  if (position === 1) {
    return "👑 #1";
  }

  if (position === 2) {
    return "🥈 #2";
  }

  return "🥉 #3";
}

export default async function LeaderboardPage() {
  const entries = await prisma.earlyAccess.findMany({
    take: 100,
    include: {
      _count: {
        select: {
          referrals: true,
        },
      },
    },
    orderBy: [{ waitlistRank: "asc" }, { createdAt: "asc" }],
  });

  const podiumEntries = entries.slice(0, 3);
  const leaderboardEntries = entries.slice(3);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-10 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-50">
                  CanaryTrack
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Referral Leaderboard
                </h1>

                <p className="max-w-2xl text-sm text-emerald-50/90 sm:text-base">
                  En güçlü topluluk elçileri burada öne çıkıyor. Sıralama,
                  referral performansı ve milestone boost skoruna göre oluşur.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Ana Sayfa
                </Link>

                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200 px-6 py-5 sm:grid-cols-3 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Total Ranked Users
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {entries.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Ranking Formula
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                referralCount × 100 + boost
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Public Signal
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                Viral momentum görünürlüğü
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {podiumEntries.length === 0 ? (
            <div className="col-span-full rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                Henüz leaderboard verisi yok.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                İlk kayıtlar geldikçe burada en güçlü referral performansı
                listelenecek.
              </p>
            </div>
          ) : (
            podiumEntries.map((entry, index) => {
              const position = index + 1;
              const progress = getReferralProgress(entry.referralCount);
              const boostScore = getBoostScore(entry.referralCount);
              const rankingScore = getRankingScore(entry.referralCount);

              return (
                <div
                  key={entry.id}
                  className={`overflow-hidden rounded-[28px] border p-6 shadow-sm ${getPodiumCardClassName(
                    position,
                  )}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-800">
                        {getPodiumBadge(position)}
                      </span>

                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                          {entry.username}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {getRoleLabel(entry.role)} · {entry.countryCode}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Final Rank
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        #{entry.waitlistRank ?? position}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Referrals
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {entry.referralCount}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        actual: {entry._count.referrals}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Boost
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">
                        +{boostScore}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        milestone etkisi
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Ranking Score
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {rankingScore}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        final ordering score
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${progress.current.highlightClassName}`}
                    >
                      {progress.current.badge} · {progress.current.shortTitle}
                    </span>

                    {position === 1 ? (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-900">
                        Top Referrer
                      </span>
                    ) : null}

                    {entry.referralCount >= 10 ? (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                        Legend Tier
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4">
                    {progress.next ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">
                            Next unlock: {progress.next.shortTitle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {progress.remainingToNext} referral kaldı
                          </p>
                        </div>

                        <div className="h-2 rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{
                              width: `${Math.max(
                                8,
                                progress.progressPercent,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">
                        Tüm milestone seviyeleri açıldı.
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Joined: {formatDateTime(entry.createdAt)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Full Leaderboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Tüm sıralama, milestone rozeti ve boost skoruyla birlikte listelenir.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Country
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Milestone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Referrals
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Boost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Ranking Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      Henüz leaderboard verisi yok.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => {
                    const progress = getReferralProgress(entry.referralCount);
                    const boostScore = getBoostScore(entry.referralCount);
                    const rankingScore = getRankingScore(entry.referralCount);
                    const position = index + 1;
                    const isTopThree = position <= 3;

                    return (
                      <tr
                        key={entry.id}
                        className={isTopThree ? "bg-amber-50/40" : "hover:bg-slate-50"}
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              #{entry.waitlistRank ?? position}
                            </span>

                            {position === 1 ? (
                              <span className="text-base">👑</span>
                            ) : null}
                            {position === 2 ? (
                              <span className="text-base">🥈</span>
                            ) : null}
                            {position === 3 ? (
                              <span className="text-base">🥉</span>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {entry.username}
                            </span>
                            <span className="text-sm text-slate-500">
                              {entry.email}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                          {getRoleLabel(entry.role)}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                          {entry.countryCode}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${progress.current.highlightClassName}`}
                            >
                              {progress.current.shortTitle}
                            </span>

                            {entry.referralCount >= 10 ? (
                              <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">
                                Legend
                              </span>
                            ) : null}

                            {position === 1 ? (
                              <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                                Top Referrer
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">
                              {entry.referralCount}
                            </span>
                            <span className="text-xs text-slate-500">
                              actual: {entry._count.referrals}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-700">
                          +{boostScore}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                          {rankingScore}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                          {formatDateTime(entry.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {leaderboardEntries.length > 0 ? (
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <p className="text-xs text-slate-500">
                İlk 3 kullanıcı özel vurgu ile gösterilir. Tüm sıralama final
                rank alanına göre listelenir.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}