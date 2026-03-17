import { z } from "zod";

export const earlyAccessSchema = z.object({
  username: z
    .string()
    .trim()
    .min(2, "Lütfen adınızı girin.")
    .max(80, "Ad alanı çok uzun."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Geçerli bir e-posta adresi girin."),
  countryCode: z
    .string()
    .trim()
    .min(2, "Ülke kodu gerekli.")
    .max(8, "Ülke kodu çok uzun."),
  role: z.enum([
    "breeder",
    "association_leader",
    "federation_representative",
    "veterinarian",
    "enthusiast",
  ]),
  referralCode: z
    .string()
    .trim()
    .toUpperCase()
    .max(32, "Referral kodu çok uzun.")
    .optional()
    .or(z.literal("")),
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

export type EarlyAccessActionState = {
  success: boolean;
  message: string;
  referralCode?: string;
  referralLink?: string;
  waitlistRank?: number | null;
  referralCount?: number;
  fieldErrors?: {
    username?: string[];
    email?: string[];
    countryCode?: string[];
    role?: string[];
    referralCode?: string[];
  };
};

export const initialEarlyAccessActionState: EarlyAccessActionState = {
  success: false,
  message: "",
  referralCode: undefined,
  referralLink: undefined,
  waitlistRank: null,
  referralCount: 0,
  fieldErrors: undefined,
};