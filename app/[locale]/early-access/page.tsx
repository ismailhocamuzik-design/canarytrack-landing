import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/dictionaries";
import { defaultLocale, locales } from "@/lib/i18n/dictionaries";
import EarlyAccessForm from "./EarlyAccessForm";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    ref?: string;
  }>;
};

function normalizeLocale(value: string): Locale {
  if (locales.includes(value as Locale)) {
    return value as Locale;
  }

  return defaultLocale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = normalizeLocale(rawLocale);

  return {
    title:
      locale === "tr"
        ? "Erken Erişim | CanaryTrack"
        : "Early Access | CanaryTrack",
    description:
      locale === "tr"
        ? "CanaryTrack erken erişimine katılın ve dünyanın ilk küresel kanarya yetiştirici ağının bir parçası olun."
        : "Join CanaryTrack early access and become part of the world’s first global canary breeder network.",
  };
}

export default async function EarlyAccessPage({
  params,
  searchParams,
}: Props) {
  const { locale: rawLocale } = await params;
  const { ref } = await searchParams;

  const locale = normalizeLocale(rawLocale);

  const title =
    locale === "tr" ? "Erken Erişim Kaydı" : "Early Access Registration";

  const description =
    locale === "tr"
      ? "İlginizi kaydedin ve yetiştiricileri, dernekleri ve federasyonları bir araya getiren ilk gerçek küresel kanarya ağına birlikte yön verelim."
      : "Register your interest and help us build the first truly global canary breeder network connecting breeders, associations, and federations.";

  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="space-y-4 text-center">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            CanaryTrack
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg">
            {description}
          </p>
        </div>

        <EarlyAccessForm
          locale={locale}
          referralCodeFromUrl={(ref ?? "").toUpperCase()}
          siteUrl={siteUrl}
        />
      </div>
    </main>
  );
}