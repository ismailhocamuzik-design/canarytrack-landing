import Link from "next/link";
import { prisma } from "../lib/prisma";
import {
  REFERRAL_MILESTONES,
  getReferralProgress,
  getRoleLabel,
} from "../lib/early-access/milestones";
import { getBoostScore, getRankingScore } from "../lib/early-access/ranking";
import EarlyAccessForm from "./components/early-access/EarlyAccessForm";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    ref?: string;
  }>;
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getMilestoneCta(referralCount: number) {
  const progress = getReferralProgress(referralCount);

  if (!progress.next) {
    return "Tüm milestone seviyeleri açık. Topluluk liderleri arasındasın.";
  }

  return `${progress.remainingToNext} referral daha yap, ${progress.next.shortTitle} kilidini aç.`;
}

function getMilestoneDescription(minReferrals: number) {
  if (minReferrals === 0) {
    return "Waitlist’e katıl ve referral yolculuğunu başlat.";
  }

  return `${minReferrals}+ referral ile bu seviye açılır.`;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const capturedRefCode = (resolvedSearchParams.ref ?? "").trim().toUpperCase();

  const [stats, leaderboardPreview] = await Promise.all([
    prisma.earlyAccess.aggregate({
      _sum: {
        referralCount: true,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.earlyAccess.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            referrals: true,
          },
        },
      },
      orderBy: [{ waitlistRank: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const totalReferrals = stats._sum.referralCount ?? 0;
  const totalApplicants = stats._count._all ?? 0;
  const averageReferral =
    totalApplicants > 0 ? totalReferrals / totalApplicants : 0;

  const featuredEntry = leaderboardPreview[0];
  const featuredProgress = featuredEntry
    ? getReferralProgress(featuredEntry.referralCount)
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                CanaryTrack Early Access
              </span>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Join the first breeders shaping CanaryTrack
                </h1>

                <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                  Leave your email and be among the first to test CanaryTrack,
                  give feedback, and help shape the future of canary breeding
                  technology.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="#early-access"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Request Early Access
                </Link>

                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  View Leaderboard
                </Link>
              </div>
            </div>

            <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Total Applicants
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {totalApplicants}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Total Referrals
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {totalReferrals}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                  Avg Referral
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                  {averageReferral.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Growth Loop
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Invite more breeders. Unlock faster access.
                  </h2>
                  <p className="max-w-2xl text-sm text-slate-200">
                    CanaryTrack referral sistemi milestone mantığıyla çalışır.
                    Her yeni davet, sıranı güçlendirir ve bir sonraki seviyenin
                    kapısını açar.
                  </p>
                </div>

                <Link
                  href="#milestones"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Milestone’ları İncele
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Step 1
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Join the waitlist
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Kayıt ol ve sana özel referral kodunu al.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Step 2
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Share your code
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Yetiştirici topluluğunu davet ederek referral biriktir.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Step 3
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    Earn rank boosts
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Milestone aç, boost al ve leaderboard’da yüksel.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-400/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Featured Referrer
              </p>

              {featuredEntry && featuredProgress ? (
                <div className="mt-4 space-y-5">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      {featuredEntry.username}
                    </h3>
                    <p className="mt-1 text-sm text-emerald-100">
                      #{featuredEntry.waitlistRank ?? 1} ·{" "}
                      {getRoleLabel(featuredEntry.role)} ·{" "}
                      {featuredEntry.countryCode}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
                        Referrals
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {featuredEntry.referralCount}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
                        Boost
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        +{getBoostScore(featuredEntry.referralCount)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
                        Score
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {getRankingScore(featuredEntry.referralCount)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${featuredProgress.current.highlightClassName}`}
                      >
                        {featuredProgress.current.badge} ·{" "}
                        {featuredProgress.current.shortTitle}
                      </span>

                      <span className="text-xs font-medium text-emerald-100">
                        {getMilestoneCta(featuredEntry.referralCount)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-emerald-50">
                  Leaderboard verisi geldikçe en güçlü referral performansı
                  burada öne çıkacak.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="early-access"
        className="border-t border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center text-white">
            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Early Access
            </span>

            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Join the first breeders shaping CanaryTrack
            </h2>

            <p className="mx-auto max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Leave your email and be among the first to test CanaryTrack, give
              feedback, and help shape the future of canary breeding
              technology.
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <EarlyAccessForm initialRefCode={capturedRefCode} />
          </div>
        </div>
      </section>

      <section
        id="milestones"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Milestone System
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Her referral seni bir sonraki seviyeye taşır
            </h2>
            <p className="max-w-3xl text-sm text-slate-600">
              Referral sistemi yalnızca paylaşımı değil, topluluk içindeki
              etkiyi de ödüllendirir. Her seviye, görünür bir badge ve güçlü bir
              rank boost sağlar.
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Full Leaderboard
          </Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          {REFERRAL_MILESTONES.map((milestone) => (
            <div
              key={milestone.key}
              className={`rounded-[28px] border p-5 shadow-sm ${milestone.highlightClassName}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                  {milestone.badge}
                </span>
                <span className="text-xs font-semibold opacity-80">
                  {milestone.minReferrals}+ referral
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight">
                {milestone.shortTitle}
              </h3>

              <p className="mt-3 text-sm leading-6 opacity-90">
                {milestone.description}
              </p>

              <div className="mt-5 rounded-2xl border border-black/5 bg-white/60 px-4 py-3 text-sm font-medium">
                {getMilestoneDescription(milestone.minReferrals)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Why Referral Works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Topluluğunu getir, erken erişimi güçlendir
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-bold text-slate-900">
                  Daha görünür sıra
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Referral ve milestone boost birleşerek waitlist konumunu daha
                  hızlı yukarı taşır.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-bold text-slate-900">
                  Güçlü topluluk sinyali
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Sadece kayıt olmak değil, başkalarını getirmek de ürünün erken
                  aşamasında daha büyük değer oluşturur.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-base font-bold text-slate-900">
                  Public leaderboard etkisi
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  En güçlü referral performansı herkese açık şekilde görünür ve
                  topluluk içinde prestij oluşturur.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Rank Logic
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Final rank sadece referral sayısı değildir
            </h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-slate-300">
                  Referral Score
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  referralCount × 100
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-slate-300">
                  Milestone Boost
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  1 ref = +3 · 3 ref = +10 · 5 ref = +20 · 10+ ref = +40
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-medium text-slate-300">
                  Final Ordering
                </p>
                <p className="mt-2 text-xl font-bold text-white">
                  Raw score + boost score
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-300">
              Böylece CanaryTrack, yalnızca ilk gelenleri değil, topluluğa en
              çok katkı sağlayan kullanıcıları da öne çıkarır.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Leaderboard Preview
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              En güçlü topluluk elçileri
            </h2>
            <p className="max-w-3xl text-sm text-slate-600">
              Public leaderboard ön izlemesi. En iyi performans gösteren
              kullanıcılar referral gücü, boost seviyesi ve final rank ile öne
              çıkar.
            </p>
          </div>

          <Link
            href="/leaderboard"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-5">
          {leaderboardPreview.length === 0 ? (
            <div className="col-span-full rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                Henüz leaderboard verisi yok.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                İlk kullanıcılar geldikçe burada güçlü bir growth sinyali
                oluşacak.
              </p>
            </div>
          ) : (
            leaderboardPreview.map((entry, index) => {
              const progress = getReferralProgress(entry.referralCount);
              const boostScore = getBoostScore(entry.referralCount);
              const rankingScore = getRankingScore(entry.referralCount);

              return (
                <div
                  key={entry.id}
                  className={`rounded-[28px] border p-5 shadow-sm ${
                    index === 0
                      ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-yellow-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
                      #{entry.waitlistRank ?? index + 1}
                    </span>

                    {index === 0 ? (
                      <span className="text-lg" aria-hidden="true">
                        👑
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      {entry.username}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {getRoleLabel(entry.role)} · {entry.countryCode}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Score
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {rankingScore}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        boost +{boostScore}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${progress.current.highlightClassName}`}
                    >
                      {progress.current.badge} · {progress.current.shortTitle}
                    </span>

                    {entry.referralCount >= 10 ? (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
                        Legend
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-5 text-xs text-slate-500">
                    Joined: {formatDateTime(entry.createdAt)}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}