"use client";

import { useActionState, useMemo, useState } from "react";
import { submitEarlyAccess } from "./actions";
import { initialEarlyAccessActionState } from "./validation";

type Props = {
  locale: "tr" | "en";
  referralCodeFromUrl: string;
  siteUrl: string;
};

const roleOptions = {
  tr: [
    { value: "breeder", label: "Yetiştirici" },
    { value: "association_leader", label: "Dernek Yöneticisi" },
    { value: "federation_representative", label: "Federasyon Temsilcisi" },
    { value: "veterinarian", label: "Veteriner" },
    { value: "enthusiast", label: "Meraklı / Hobi" },
  ],
  en: [
    { value: "breeder", label: "Breeder" },
    { value: "association_leader", label: "Association Leader" },
    { value: "federation_representative", label: "Federation Representative" },
    { value: "veterinarian", label: "Veterinarian" },
    { value: "enthusiast", label: "Enthusiast / Hobbyist" },
  ],
};

export default function EarlyAccessForm({
  locale,
  referralCodeFromUrl,
  siteUrl,
}: Props) {
  const [state, formAction, pending] = useActionState(
    submitEarlyAccess,
    initialEarlyAccessActionState,
  );
  const [copySuccess, setCopySuccess] = useState(false);

  const labels =
    locale === "tr"
      ? {
          username: "Ad Soyad",
          email: "E-posta",
          countryCode: "Ülke Kodu",
          role: "Rol",
          submit: "Erken Erişime Katıl",
          pending: "Gönderiliyor...",
          successTitle: "Harika, waitlist’e girdiniz 🎉",
          waitlistRank: "Sıranız",
          referralTitle: "Kişisel davet linkiniz",
          referralHint: "Arkadaşlarını davet ederek listenin üstüne çık.",
          referralCount: "Toplam davet",
          rolePlaceholder: "Rol seçin",
          shareTitle: "Bağlantını paylaş",
          shareDescription:
            "Daha fazla davet gönder, listede daha yukarı çık.",
          whatsapp: "WhatsApp",
          x: "X",
          facebook: "Facebook",
          copy: "Linki Kopyala",
          copied: "Link kopyalandı",
          shareText:
            "CanaryTrack erken erişimine katıldım. Sen de katıl:",
        }
      : {
          username: "Full Name",
          email: "Email",
          countryCode: "Country Code",
          role: "Role",
          submit: "Join Early Access",
          pending: "Submitting...",
          successTitle: "You are on the waitlist 🎉",
          waitlistRank: "Your rank",
          referralTitle: "Your personal referral link",
          referralHint: "Invite your friends and move up the list.",
          referralCount: "Total referrals",
          rolePlaceholder: "Select role",
          shareTitle: "Share your link",
          shareDescription:
            "Invite more people and move higher on the waitlist.",
          whatsapp: "WhatsApp",
          x: "X",
          facebook: "Facebook",
          copy: "Copy Link",
          copied: "Link copied",
          shareText:
            "I joined CanaryTrack early access. Join with my invite link:",
        };

  const options = locale === "tr" ? roleOptions.tr : roleOptions.en;

  const referralLink = state.referralLink ?? "";
  const encodedReferralLink = encodeURIComponent(referralLink);
  const encodedShareText = encodeURIComponent(
    `${labels.shareText} ${referralLink}`,
  );

  const shareUrls = useMemo(() => {
    return {
      whatsapp: `https://wa.me/?text=${encodedShareText}`,
      x: `https://twitter.com/intent/tweet?text=${encodedShareText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedReferralLink}`,
    };
  }, [encodedReferralLink, encodedShareText]);

  async function handleCopyLink() {
    if (!referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);

      window.setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch {
      setCopySuccess(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-8">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="referralCode" value={referralCodeFromUrl} />
          <input type="hidden" name="siteUrl" value={siteUrl} />

          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              {labels.username}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              placeholder={locale === "tr" ? "Adınızı yazın" : "Enter your full name"}
            />
            {state.fieldErrors?.username?.[0] ? (
              <p className="mt-2 text-sm text-red-400">
                {state.fieldErrors.username[0]}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-white/90"
            >
              {labels.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
              placeholder="you@example.com"
            />
            {state.fieldErrors?.email?.[0] ? (
              <p className="mt-2 text-sm text-red-400">
                {state.fieldErrors.email[0]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="countryCode"
                className="mb-2 block text-sm font-medium text-white/90"
              >
                {labels.countryCode}
              </label>
              <input
                id="countryCode"
                name="countryCode"
                type="text"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
                placeholder={locale === "tr" ? "TR" : "US"}
                defaultValue={locale === "tr" ? "TR" : ""}
              />
              {state.fieldErrors?.countryCode?.[0] ? (
                <p className="mt-2 text-sm text-red-400">
                  {state.fieldErrors.countryCode[0]}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-white/90"
              >
                {labels.role}
              </label>
              <select
                id="role"
                name="role"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60"
                defaultValue=""
              >
                <option value="" disabled>
                  {labels.rolePlaceholder}
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.role?.[0] ? (
                <p className="mt-2 text-sm text-red-400">
                  {state.fieldErrors.role[0]}
                </p>
              ) : null}
            </div>
          </div>

          {state.message ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                state.success
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-red-400/30 bg-red-400/10 text-red-300"
              }`}
            >
              {state.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? labels.pending : labels.submit}
          </button>
        </form>

        {state.success && state.referralCode ? (
          <div className="mt-6 space-y-4 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <h2 className="text-xl font-semibold text-white">
              {labels.successTitle}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {labels.waitlistRank}
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {state.waitlistRank ? `#${state.waitlistRank}` : "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {labels.referralCount}
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {state.referralCount ?? 0}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-sm font-medium text-white">
                {labels.referralTitle}
              </p>
              <p className="mt-2 break-all rounded-xl bg-slate-950 px-3 py-3 text-sm text-cyan-300">
                {referralLink}
              </p>
              <p className="mt-3 text-sm text-white/60">{labels.referralHint}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-white">
                  {labels.shareTitle}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {labels.shareDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <a
                  href={shareUrls.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  {labels.whatsapp}
                </a>

                <a
                  href={shareUrls.x}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  {labels.x}
                </a>

                <a
                  href={shareUrls.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  {labels.facebook}
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  {copySuccess ? labels.copied : labels.copy}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}