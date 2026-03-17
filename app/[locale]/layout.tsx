import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  dictionaries,
  defaultLocale,
  type Locale,
  locales,
} from "@/lib/i18n/dictionaries";

type Props = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = locales.includes(resolvedParams.locale as Locale)
    ? (resolvedParams.locale as Locale)
    : defaultLocale;

  const dict = dictionaries[locale];
  const canonicalUrl = `https://trycanarytrack.com/${locale}`;

  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: "https://trycanarytrack.com/tr",
        en: "https://trycanarytrack.com/en",
      },
    },
    openGraph: {
      title: dict.metaTitle,
      description: dict.metaDescription,
      url: canonicalUrl,
      siteName: "CanaryTrack",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metaTitle,
      description: dict.metaDescription,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}