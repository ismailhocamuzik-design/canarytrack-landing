import Link from "next/link";
import LanguageSwitcher from "../../components/landing/LanguageSwitcher";
import EarlyAccessForm from "../components/early-access/EarlyAccessForm";import {
  defaultLocale,
  dictionaries,
  locales,
  type Locale,
} from "../../lib/i18n/dictionaries";

type Props = {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    ref?: string;
  }>;
};

export default async function LocalizedHomePage({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  const locale = locales.includes(resolvedParams.locale as Locale)
    ? (resolvedParams.locale as Locale)
    : defaultLocale;

  const capturedRefCode = (resolvedSearchParams.ref ?? "")
    .trim()
    .toUpperCase();

  const dict = dictionaries[locale];

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
          <Link
            href={`/${locale}`}
            className="shrink-0 text-lg font-semibold tracking-tight text-white"
          >
            CanaryTrack
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            <a href="#features" className="transition hover:text-white">
              {dict.nav.features}
            </a>
            <a href="#vision" className="transition hover:text-white">
              {dict.nav.vision}
            </a>
            <a href="#audience" className="transition hover:text-white">
              {dict.nav.audience}
            </a>
            <a href="#ambassadors" className="transition hover:text-white">
              {dict.nav.ambassadors}
            </a>
            <a href="#early-access" className="transition hover:text-white">
              {dict.nav.earlyAccess}
            </a>
          </nav>

          <div className="shrink-0">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_right,rgba(59,130,246,0.14),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
              {dict.hero.badge}
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              <span className="bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent">
                {dict.hero.title}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">
              {dict.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#early-access"
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                {dict.hero.primaryCta}
              </a>
              <a
                href="#features"
                className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                {dict.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {dict.hero.highlights.map((item: string) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <p className="text-sm font-medium text-white/85">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <h2 className="text-lg font-semibold text-white/90">
              {dict.trust.title}
            </h2>

            <div className="flex flex-wrap gap-3">
              {dict.trust.items.map((item: string) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {dict.features.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.features.title}
          </h2>
          <p className="mt-4 text-white/70">{dict.features.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dict.features.items.map(
            (feature: { title: string; text: string }) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {feature.text}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      <section id="vision" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                {dict.vision.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {dict.vision.title}
              </h2>
              <p className="mt-5 text-white/70">{dict.vision.paragraph1}</p>
              <p className="mt-4 text-white/70">{dict.vision.paragraph2}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dict.vision.stats.map((item: string) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-neutral-900 p-6"
                >
                  <p className="text-base font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="audience"
        className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {dict.audience.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {dict.audience.title}
          </h2>
          <p className="mt-4 text-white/70">{dict.audience.description}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {dict.audience.items.map((item: { title: string; text: string }) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="ambassadors"
        className="border-y border-white/10 bg-white/[0.03]"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                {dict.ambassadors.eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {dict.ambassadors.title}
              </h2>
              <p className="mt-5 max-w-3xl text-white/70">
                {dict.ambassadors.description}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6">
              <div className="space-y-4">
                {dict.ambassadors.points.map((point: string) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-sm font-medium text-white/85">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="early-access"
        className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:px-12"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          {dict.earlyAccess.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {dict.earlyAccess.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          {dict.earlyAccess.description}
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <EarlyAccessForm
            initialRefCode={capturedRefCode}
            initialLocale={locale}
          />
        </div>

        <p className="mt-4 text-xs text-white/40">{dict.earlyAccess.note}</p>
      </section>

      <footer className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/50 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <span className="font-semibold text-white">
              {dict.footer.brand}
            </span>{" "}
            — {dict.footer.text}
          </div>
          <div>{dict.footer.rights}</div>
        </div>
      </footer>
    </main>
  );
}