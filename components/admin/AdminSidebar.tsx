"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Waitlist",
    href: "/admin/waitlist",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">CanaryTrack</h2>
        <p className="text-xs text-slate-500">Admin Panel</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navigation.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}