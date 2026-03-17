export function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (appUrl && appUrl.length > 0) {
    return appUrl.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export function createReferralJoinUrl(referralCode: string) {
  const baseUrl = getBaseUrl();
  const url = new URL(baseUrl);

  url.searchParams.set("ref", referralCode);

  return url.toString();
}

export function createSuccessUrl(referralCode: string) {
  const baseUrl = getBaseUrl();
  const url = new URL("/early-access/success", baseUrl);

  url.searchParams.set("code", referralCode);

  return url.toString();
}

export function createWhatsappShareUrl(referralCode: string) {
  const joinUrl = createReferralJoinUrl(referralCode);
  const text =
    `CanaryTrack early access waitlist’ine katıldım. ` +
    `Sen de bu linkle katıl: ${joinUrl}`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function createXShareUrl(referralCode: string) {
  const joinUrl = createReferralJoinUrl(referralCode);
  const text =
    "CanaryTrack early access waitlist’ine katıldım. " +
    "Sen de referral linkimle katıl.";

  return `https://x.com/intent/tweet?text=${encodeURIComponent(
    text,
  )}&url=${encodeURIComponent(joinUrl)}`;
}

export function createMailtoShareUrl(referralCode: string) {
  const joinUrl = createReferralJoinUrl(referralCode);
  const subject = "CanaryTrack early access daveti";
  const body =
    `CanaryTrack early access waitlist’ine katıldım.\n\n` +
    `Sen de bu referral link ile katılabilirsin:\n${joinUrl}`;

  return `mailto:?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

export function createReferralShareText(referralCode: string) {
  const joinUrl = createReferralJoinUrl(referralCode);

  return `CanaryTrack early access waitlist’ine katıldım. Sen de bu referral link ile katıl: ${joinUrl}`;
}