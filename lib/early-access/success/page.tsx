import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import {
  getReferralProgress,
  getRoleLabel,
} from "../../../lib/early-access/milestones";
import {
  getBaseUrl,
  createMailtoShareUrl,
  createReferralJoinUrl,
  createReferralShareText,
  createWhatsappShareUrl,
  createXShareUrl,
} from "../../../lib/early-access/share";
import { getBoostScore, getRankingScore } from "../../../lib/early-access/ranking";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    code?: string;
    email?: string;
  }>;
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function EarlyAccessSuccessPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const referralCode = (resolvedSearchParams.code ?? "").trim();
  const email = (resolvedSearchParams.email ?? "").trim().toLowerCase();

  if (!referralCode && !email) {
    notFound();
  }

  const entry = await prisma.earlyAccess.findFirst({
    where: referralCode
      ? {
          referralCode,
        }
      : {
          email,
        },
    include: {
      _count: {
        select: {
          referrals: true,
        },
      },
      referredBy: {
        select: {
          username: true,
          referralCode: true,
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

  const referralJoinUrl = createReferralJoinUrl(entry.referralCode);
  const referralShareText = createReferralShareText(entry.referralCode);
  const whatsappShareUrl = createWhatsappShareUrl(entry.referralCode);
  const xShareUrl = createXShareUrl(entry.referralCode);
  const mailtoShareUrl = createMailtoShareUrl(entry.referralCode);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                CanaryTrack Early Access
              </span>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Kayıt tamamlandı. Şimdi referral gücünü kullan.
                </h1>

                <p className="max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                  Waitlist kaydın başarıyla alındı. Referral kodunu paylaşarak
                  milestone açabilir, boost kazanabilir ve sıranı güçlendirebilirsin.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/leaderboard"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Leaderboard Gör
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Success Summary
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Waitlist Rank
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                    #{entry.waitlistRank ?? "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Referral Count
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                    {entry.referralCount}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    actual: {entry._count.referrals}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Boost
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                    +{boostScore}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Ranking Score
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-white">
                    {rankingScore}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Referral Code
                  </p>
                  <p className="mt-2 break-all font-mono text-lg font-bold text-white">
                    {entry.referralCode}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Bu kod ile yeni kullanıcılar sana bağlanır.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/10 p-4 lg:min-w-[240px]">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Current Milestone
                  </p>

                  <div className="mt-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${progress.current.highlightClassName}`}
                    >
                      {progress.current.badge} · {progress.current.shortTitle}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-300">
                    {progress.current.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-emerald-400/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Next Unlock
              </p>

              {progress.next ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">
                      {progress.next.title}
                    </h2>
                    <p className="mt-2 text-sm text-emerald-100">
                      {progress.remainingToNext} referral daha yaparsan bir üst
                      seviyeye geçersin.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white">
                        Progress
                      </span>
                      <span className="text-xs text-emerald-100">
                        {Math.round(progress.progressPercent)}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-white/15">
                      <div
                        className="h-2 rounded-full bg-emerald-300"
                        style={{
                          width: `${Math.max(6, progress.progressPercent)}%`,
                        }}
                      />
                    </div>

                    <p className="mt-3 text-sm text-emerald-100">
                      {progress.remainingToNext} referral kaldı.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
                      Growth Message
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white">
                      Arkadaşlarını davet et, waitlist sıralamasında öne çık ve
                      CanaryTrack’e daha güçlü bir başlangıç yap.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-amber-300/30 bg-amber-200/10 p-5">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Tüm milestone seviyeleri açık
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-emerald-100">
                    Maksimum boost seviyesine ulaştın. Artık leaderboard’daki
                    görünürlüğünü büyütmeye devam edebilirsin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Referral Share Box
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Linkini paylaş ve kullanıcı davet et
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Bu sayfayı kayıt sonrası kişisel referral merkezine çeviriyoruz.
                  Linkin hazır, paylaşım metnin hazır ve milestone hedefin net.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Base URL
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {getBaseUrl()}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Referral Link
                </p>
                <p className="mt-2 break-all text-sm font-medium text-slate-900">
                  {referralJoinUrl}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Share Text
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {referralShareText}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  href={whatsappShareUrl}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  WhatsApp’ta Paylaş
                </Link>

                <Link
                  href={xShareUrl}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  X’te Paylaş
                </Link>

                <Link
                  href={mailtoShareUrl}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  E-posta Gönder
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Account Snapshot
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Username
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {entry.username}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Profile
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {getRoleLabel(entry.role)} · {entry.countryCode}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Joined
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDateTime(entry.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Referred By
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {entry.referredBy
                    ? `${entry.referredBy.username} · ${entry.referredBy.referralCode}`
                    : "Direct signup"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Milestone Roadmap
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Şu an bulunduğun yer ve sıradaki hedef
              </h2>
            </div>

            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Leaderboard’a Git
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {progress.unlockedMilestones.map((milestone) => (
              <div
                key={milestone.key}
                className={`rounded-[28px] border p-5 shadow-sm ${milestone.highlightClassName}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                    {milestone.badge}
                  </span>
                  <span className="text-xs font-semibold opacity-80">
                    Açıldı
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {milestone.shortTitle}
                </h3>

                <p className="mt-3 text-sm leading-6 opacity-90">
                  {milestone.description}
                </p>
              </div>
            ))}

            {progress.next ? (
              <div
                className={`rounded-[28px] border p-5 shadow-sm ${progress.next.highlightClassName}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                    {progress.next.badge}
                  </span>
                  <span className="text-xs font-semibold opacity-80">
                    Sıradaki hedef
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight">
                  {progress.next.shortTitle}
                </h3>

                <p className="mt-3 text-sm leading-6 opacity-90">
                  {progress.remainingToNext} referral daha yaparsan bu seviye açılır.
                </p>

                <div className="mt-5 h-2 rounded-full bg-white/50">
                  <div
                    className="h-2 rounded-full bg-emerald-600"
                    style={{
                      width: `${Math.max(6, progress.progressPercent)}%`,
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}