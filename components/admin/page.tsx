export const dynamic = "force-dynamic";

export default function AdminHomePage() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">
        CanaryTrack Admin
      </h1>

      <p className="mt-2 text-sm text-slate-600">
        Yönetim paneline hoş geldiniz.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">
          Waitlist verilerini görmek için sol menüden <strong>Waitlist</strong> sayfasını açabilirsiniz.
        </p>
      </div>
    </div>
  );
}