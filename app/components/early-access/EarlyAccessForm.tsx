"use client";

import { useEffect, useState } from "react";

type Props = {
  initialRefCode?: string;
  initialLocale?: string;
};

type EarlyAccessApiResponse = {
  ok: boolean;
  redirectTo?: string;
  message?: string;
};

export default function EarlyAccessForm({
  initialRefCode = "",
  initialLocale = "tr",
}: Props) {
  const [refCode, setRefCode] = useState(initialRefCode);
  const [locale, setLocale] = useState(initialLocale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");

  useEffect(() => {
    setRefCode(initialRefCode);
  }, [initialRefCode]);

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale]);

  async function handleRequestAccess() {
    if (isSubmitting) {
      return;
    }

    if (!email.trim()) {
      setErrorMessage("E-posta zorunludur.");
      setDebugMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setDebugMessage("İstek gönderiliyor...");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username: name,
          countryCode: "TR",
          role: "enthusiast",
          ref: refCode,
          locale,
        }),
      });

      let result: EarlyAccessApiResponse;

      try {
        result = (await response.json()) as EarlyAccessApiResponse;
      } catch {
        setErrorMessage("API geçerli bir yanıt dönmedi.");
        setDebugMessage("");
        setIsSubmitting(false);
        return;
      }

      if (!response.ok || !result.ok || !result.redirectTo) {
        setErrorMessage(result.message ?? "Kayıt tamamlanamadı.");
        setDebugMessage("");
        setIsSubmitting(false);
        return;
      }

      setDebugMessage(`Yönlendiriliyor: ${result.redirectTo}`);
      window.location.href = result.redirectTo;
    } catch (error) {
      console.error(error);
      setErrorMessage("Kayıt sırasında bağlantı hatası oluştu.");
      setDebugMessage("");
      setIsSubmitting(false);
    }
  }

  return (
    <div id="early-access-form" className="space-y-4">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="text"
          name="username"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleRequestAccess();
            }
          }}
          placeholder="Your name or breeder name"
          className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35 focus:border-emerald-400/40"
        />

        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void handleRequestAccess();
            }
          }}
          placeholder="Your email address"
          className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35 focus:border-emerald-400/40"
        />

        <button
          type="button"
          onClick={() => {
            void handleRequestAccess();
          }}
          disabled={isSubmitting}
          className="h-14 rounded-2xl bg-white px-6 font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Request Early Access"}
        </button>
      </div>

      {refCode ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Referral Captured
          </p>
          <p className="mt-1 text-sm text-emerald-100">
            Bu kayıt referral code ile oluşturulacak:{" "}
            <span className="font-mono font-semibold">{refCode}</span>
          </p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-medium text-red-200">{errorMessage}</p>
        </div>
      ) : null}

      {debugMessage ? (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
          <p className="text-sm font-medium text-cyan-200">{debugMessage}</p>
        </div>
      ) : null}

      <p className="text-center text-xs text-white/40">
        Spam yok. Sadece ürün güncellemeleri, erken erişim ve lansman haberleri.
      </p>
    </div>
  );
}