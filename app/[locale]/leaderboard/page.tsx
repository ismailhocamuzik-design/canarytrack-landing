import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import {
  getReferralProgress,
  getRoleLabel,
} from "../../../lib/early-access/milestones";
import {
  getBoostScore,
  getRankingScore,
} from "../../../lib/early-access/ranking";
import {
  defaultLocale,
  dictionaries,
  type Locale,
  locales,
} from "../../../lib/i18n/dictionaries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    locale: string;
  }>;
};

function formatDateTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-US", {
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

export default async function LeaderboardPage({ params }: Props) {
  const resolvedParams = await params;

  const locale = locales.includes(resolvedParams.locale as Locale)
    ? (resolvedParams.locale as Locale)
    : defaultLocale;

  const dict = dictionaries[locale];

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

  const copy = {
    brand: "CanaryTrack",
    title: locale === "tr" ? "Referral Leaderboard" : "Referral Leaderboard",
    description:
      locale === "tr"
        ? "En güçlü topluluk elçileri burada öne çıkıyor. Sıralama, referral performansı ve milestone boost skoruna göre oluşur."
        : "The strongest community ambassadors stand out here. Ranking is based on referral performance and milestone boost score.",
    home: locale === "tr" ? "Ana Sayfa" : "Home",
    totalRankedUsers:
      locale === "tr" ? "Toplam Sıralanan Kullanıcı" : "Total Ranked Users",
    rankingFormula: locale === "tr" ? "Sıralama Formülü" : "Ranking Formula",
    publicSignal: locale === "tr" ? "Public Signal" : "Public Signal",
    publicSignalValue:
      locale === "tr" ? "Viral momentum görünürlüğü" : "Viral momentum visibility",
    noDataTitle:
      locale === "tr"
        ? "Henüz leaderboard verisi yok."
        : "There is no leaderboard data yet.",
    noDataText:
      locale === "tr"
        ? "İlk kayıtlar geldikçe burada en güçlü referral performansı listelenecek."
        : "As the first registrations arrive, the strongest referral performance will be listed here.",
    finalRank: locale === "tr" ? "Final Rank" : "Final Rank",
    referrals: locale === "tr" ? "Referrals" : "Referrals",
    boost: locale === "tr" ? "Boost" : "Boost",
    rankingScore: locale === "tr" ? "Ranking Score" : "Ranking Score",
    actual: locale === "tr" ? "gerçek" : "actual",
    milestoneEffect: locale === "tr" ? "milestone etkisi" : "milestone effect",
    finalOrderingScore:
      locale === "tr" ? "nihai sıralama skoru" : "final ordering score",
    topReferrer: locale === "tr" ? "Top Referrer" : "Top Referrer",
    legendTier: locale === "tr" ? "Legend Tier" : "Legend Tier",
    nextUnlock: locale === "tr" ? "Sıradaki seviye" : "Next unlock",
    referralsLeft:
      locale === "tr" ? "referral kaldı" : "referrals left",
    allMilestonesUnlocked:
      locale === "tr"
        ? "Tüm milestone seviyeleri açıldı."
        : "All milestone levels are unlocked.",
    joined: locale === "tr" ? "Katıldı" : "Joined",
    fullLeaderboard:
      locale === "tr" ? "Tüm Leaderboard" : "Full Leaderboard",
    fullLeaderboardText:
      locale === "tr"
        ? "Tüm sıralama, milestone rozeti ve boost skoruyla birlikte listelenir."
        : "The full ranking is listed together with milestone badges and boost score.",
    rank: locale === "tr" ? "Sıra" : "Rank",
    user: locale === "tr" ? "Kullanıcı" : "User",
    role: locale === "tr" ? "Rol" : "Role",
    country: locale === "tr" ? "Ülke" : "Country",
    milestone: locale === "tr" ? "Milestone" : "Milestone",
    legend: locale === "tr" ? "Legend" : "Legend",
    footerNote:
      locale === "tr"
        ? "İlk 3 kullanıcı özel vurgu ile gösterilir. Tüm sıralama final rank alanına göre listelenir."
        : "The top 3 users are shown with special emphasis. The full ranking is listed by final rank.",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 py-10 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-50">
                  {copy.brand}
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {copy.title}
                </h1>

                <p className="max-w-2xl text-sm text-emerald-50/90 sm:text-base">
                  {copy.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {copy.home}
                </Link>

                <a
                  href={`/${locale}#early-access`}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  {dict.nav.earlyAccess}
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-slate-200 px-6 py-5 sm:grid-cols-3 sm:px-8">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {copy.totalRankedUsers}
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {entries.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {copy.rankingFormula}
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                referralCount × 100 + boost
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {copy.publicSignal}
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-slate-900">
                {copy.publicSignalValue}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {podiumEntries.length === 0 ? (
            <div className="col-span-full rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                {copy.noDataTitle}
              </p>
              <p className="mt-2 text-sm text-slate-500">{copy.noDataText}</p>
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
                        {copy.finalRank}
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                        #{entry.waitlistRank ?? position}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {copy.referrals}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {entry.referralCount}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {copy.actual}: {entry._count.referrals}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {copy.boost}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-emerald-700">
                        +{boostScore}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {copy.milestoneEffect}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {copy.rankingScore}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {rankingScore}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {copy.finalOrderingScore}
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
                        {copy.topReferrer}
                      </span>
                    ) : null}

                    {entry.referralCount >= 10 ? (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                        {copy.legendTier}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4">
                    {progress.next ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">
                            {copy.nextUnlock}: {progress.next.shortTitle}
                          </p>
                          <p className="text-xs text-slate-500">
                            {progress.remainingToNext} {copy.referralsLeft}
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
                        {copy.allMilestonesUnlocked}
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    {copy.joined}: {formatDateTime(entry.createdAt, locale)}
                  </p>
                </div>
              );
            })
          )}
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {copy.fullLeaderboard}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {copy.fullLeaderboardText}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.rank}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.user}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.role}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.country}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.milestone}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.referrals}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.boost}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.rankingScore}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {copy.joined}
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
                      {copy.noDataTitle}
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
                                {copy.legend}
                              </span>
                            ) : null}

                            {position === 1 ? (
                              <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                                {copy.topReferrer}
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
                              {copy.actual}: {entry._count.referrals}
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
                          {formatDateTime(entry.createdAt, locale)}
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
              <p className="text-xs text-slate-500">{copy.footerNote}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}