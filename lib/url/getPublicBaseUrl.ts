import { headers } from "next/headers";

function normalizeUrl(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function getPreferredVercelUrl() {
  const projectProductionUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (projectProductionUrl) {
    return normalizeUrl(projectProductionUrl);
  }

  const vercelProjectProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (vercelProjectProductionUrl) {
    return normalizeUrl(`https://${vercelProjectProductionUrl}`);
  }

  const vercelBranchUrl = process.env.VERCEL_BRANCH_URL?.trim();

  if (vercelBranchUrl) {
    return normalizeUrl(`https://${vercelBranchUrl}`);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return normalizeUrl(`https://${vercelUrl}`);
  }

  return null;
}

export async function getPublicBaseUrl() {
  const preferredUrl = getPreferredVercelUrl();

  if (preferredUrl) {
    return preferredUrl;
  }

  const headerStore = await headers();

  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";

  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");

  return normalizeUrl(`${protocol}://${host}`);
}