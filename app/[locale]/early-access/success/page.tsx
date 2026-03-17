import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBaseUrl } from "../../../../lib/url/getPublicBaseUrl";
import {
  defaultLocale,
  dictionaries,
  type Locale,
  locales,
} from "../../../../lib/i18n/dictionaries";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    code?: string;
  }>;
};

export default async function EarlyAccessSuccessPage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const locale = locales.includes(resolvedParams.locale as Locale)
    ? (resolvedParams.locale as Locale)
    : defaultLocale;

  if (!resolvedSearchParams.code) {
    notFound();
  }

  const dict = dictionaries[locale];
  const baseUrl = await getPublicBaseUrl();
  const referralCode = resolvedSearchParams.code.trim();
  const inviteUrl = `${baseUrl}/${locale}?ref=${encodeURIComponent(referralCode)}`;

  const shareText =
    locale === "tr"
      ? `CanaryTrack erken erişim listesine ben de katıldım. Sen de kayıt ol: ${inviteUrl}`
      : `I joined the CanaryTrack early access list. You can sign up here: ${inviteUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    inviteUrl,
  )}&text=${encodeURIComponent(
    locale === "tr"
      ? "CanaryTrack erken erişim listesine katıl"
      : "Join the CanaryTrack early access list",
  )}`;

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16 sm:px-8">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur sm:p-10">
          <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
            {dict.earlyAccess.success.badge}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {dict.earlyAccess.success.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300 sm:text-lg">
            {dict.earlyAccess.success.description}
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-neutral-400">
                {dict.earlyAccess.success.referralCodeLabel}
              </p>
              <p className="mt-2 break-all text-2xl font-semibold tracking-[0.2em] text-white">
                {referralCode}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-neutral-400">
                {dict.earlyAccess.success.shareLinkLabel}
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-neutral-200 sm:text-base">
                {inviteUrl}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              {dict.earlyAccess.success.shareWhatsapp}
            </a>

            <a
              href={xUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dict.earlyAccess.success.shareX}
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dict.earlyAccess.success.shareTelegram}
            </a>
          </div>

          <div className="mt-8">
            <label
              htmlFor="invite-link"
              className="mb-2 block text-sm font-medium text-neutral-300"
            >
              {dict.earlyAccess.success.copyLinkLabel}
            </label>
            <input
              id="invite-link"
              value={inviteUrl}
              readOnly
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none ring-0"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
            >
              {dict.earlyAccess.success.backHome}
            </Link>

            <Link
              href={`/${locale}/leaderboard`}
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {dict.earlyAccess.success.viewLeaderboard}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}