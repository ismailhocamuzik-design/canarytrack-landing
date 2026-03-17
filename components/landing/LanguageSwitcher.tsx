import Link from "next/link";
import { Locale } from "@/lib/i18n/dictionaries";

type Props = {
  currentLocale: Locale;
};

const items: { code: Locale; label: string }[] = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
];

export default function LanguageSwitcher({ currentLocale }: Props) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-sm">
      {items.map((item) => {
        const isActive = currentLocale === item.code;

        return (
          <Link
            key={item.code}
            href={`/${item.code}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-white text-black"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}