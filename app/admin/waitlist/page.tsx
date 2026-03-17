import Link from "next/link";
import { EarlyAccessRole, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import { getReferralProgress, getRoleLabel } from "../../../lib/early-access/milestones";
import { getBoostScore, getRankingScore } from "../../../lib/early-access/ranking";
import { recalculateWaitlistRanksAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    role?: string;
    country?: string;
  }>;
};

const roleOptions = [
  EarlyAccessRole.breeder,
  EarlyAccessRole.association_leader,
  EarlyAccessRole.federation_representative,
  EarlyAccessRole.veterinarian,
  EarlyAccessRole.enthusiast,
] as const;

function buildWhere(
  role?: string,
  country?: string,
): Prisma.EarlyAccessWhereInput {
  const where: Prisma.EarlyAccessWhereInput = {};

  if (role && roleOptions.includes(role as EarlyAccessRole)) {
    where.role = role as EarlyAccessRole;
  }

  if (country && country.trim() !== "") {
    where.countryCode = country.trim().toUpperCase();
  }

  return where;
}

function createExportHref(role?: string, country?: string) {
  const params = new URLSearchParams();

  if (role) {
    params.set("role", role);
  }

  if (country) {
    params.set("country", country);
  }

  const query = params.toString();

  return query
    ? `/admin/waitlist/export?${query}`
    : "/admin/waitlist/export";
}

function createResetHref() {
  return "/admin/waitlist";
}

export default async function AdminWaitlistPage({ searchParams }: PageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedRole = resolvedSearchParams.role ?? "";
  const selectedCountry = (resolvedSearchParams.country ?? "").toUpperCase();

  const where = buildWhere(selectedRole, selectedCountry);

  const [entries, countryRows, totalCount, filteredCount] = await Promise.all([
    prisma.earlyAccess.findMany({
      where,
      include: {
        _count: {
          select: {
            referrals: true,
          },
        },
      },
      orderBy: [
        { waitlistRank: "asc" },
        { createdAt: "asc" },
      ],
    }),
    prisma.earlyAccess.findMany({
      select: {
        countryCode: true,
      },
      distinct: ["countryCode"],
      orderBy: {
        countryCode: "asc",
      },
    }),
    prisma.earlyAccess.count(),
    prisma.earlyAccess.count({
      where,
    }),
  ]);

  const countries = countryRows
    .map((row) => row.countryCode)
    .filter((value) => value && value.trim() !== "");

  const activeFilterCount =
    (selectedRole ? 1 : 0) +
    (selectedCountry ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            CanaryTrack Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Waitlist Management
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Waitlist artık milestone boost algoritmasına göre sıralanır.
            Final rank hesaplaması: <span className="font-semibold">referralCount × 100 + boostScore</span>.
            Eşitlik durumunda daha erken kayıt olan kullanıcı üstte kalır.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <form action={recalculateWaitlistRanksAction}>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Recalculate Ranks
            </button>
          </form>

          <Link
            href={createExportHref(selectedRole, selectedCountry)}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Export CSV
          </Link>

          <Link
            href={createResetHref()}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset Filters
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Applications</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {totalCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Filtered Results</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {filteredCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Filters</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {activeFilterCount}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Ranking Logic</p>
          <p className="mt-2 text-lg font-bold tracking-tight text-slate-900">
            Raw + Boost
          </p>
          <p className="mt-2 text-xs text-slate-500">
            referralCount × 100 + milestone boost
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-sm font-semibold text-slate-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue={selectedRole}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="">All roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {getRoleLabel(role)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="text-sm font-semibold text-slate-700"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              defaultValue={selectedCountry}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            >
              <option value="">All countries</option>
              {countries.map((countryCode) => (
                <option key={countryCode} value={countryCode}>
                  {countryCode}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex h-[50px] items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Apply Filters
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Waitlist Entries
            </h2>
            <p className="text-sm text-slate-500">
              Final rank, raw referral, boost ve ranking score birlikte gösterilir.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1400px] divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Final Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Raw Referral
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Boost
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Ranking Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Milestone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Seçili filtrelerle eşleşen kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => {
                  const boostScore = getBoostScore(entry.referralCount);
                  const rankingScore = getRankingScore(entry.referralCount);
                  const progress = getReferralProgress(entry.referralCount);

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                        {entry.waitlistRank ?? "-"}
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

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-slate-700">
                        {entry.referralCode}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-900">
                            {entry.referralCount}
                          </span>
                          <span className="text-xs text-slate-500">
                            actual: {entry._count.referrals}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-700">
                        +{boostScore}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                        {rankingScore}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${progress.current.highlightClassName}`}
                        >
                          {progress.current.shortTitle}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                        {new Intl.DateTimeFormat("tr-TR", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(entry.createdAt)}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link
                          href={`/admin/waitlist/referral/${entry.id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          Referral Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}