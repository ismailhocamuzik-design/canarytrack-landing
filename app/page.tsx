export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.18),transparent_35%),radial-gradient(circle_at_right,rgba(59,130,246,0.14),transparent_30%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center sm:px-8 lg:px-12 lg:py-32">
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
            Global Canary Breeding Management Platform
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Manage your canary breeding operation with{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              clarity, control, and confidence
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            CanaryTrack helps breeders organize birds, pairings, chicks, lineage,
            performance, sales, and expenses in one professional platform built
            for the future of canary breeding worldwide.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#early-access"
              className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Join Early Access
            </a>
            <a
              href="#features"
              className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Bird & breeder records",
              "Smart pairing tracking",
              "Pedigree & kinship control",
              "Sales, costs & performance",
            ].map((item) => (
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

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything breeders need in one platform
          </h2>
          <p className="mt-4 text-white/70">
            Built for serious breeders who want better organization, safer matching,
            and stronger breeding decisions.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "Bird Management",
              text: "Track every bird with identity, gender, color, age, breeder, notes, and status in one clean system.",
            },
            {
              title: "Pairing Intelligence",
              text: "Monitor active and past pairings, identify risky combinations, and improve breeding decisions over time.",
            },
            {
              title: "Pedigree & Kinship",
              text: "Visualize lineage and reduce close-relative pairings with better family awareness across your stock.",
            },
            {
              title: "Nest & Chick Tracking",
              text: "Follow eggs, hatch dates, chick development, and outcomes from pairing to production.",
            },
            {
              title: "Sales & Expense Control",
              text: "Record transactions, understand profitability, and track the financial side of your breeding operation.",
            },
            {
              title: "Breeder Performance",
              text: "Measure productivity, fertility, hatch success, and long-term breeding efficiency.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                Global Vision
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From local breeder records to a global breeding ecosystem
              </h2>
              <p className="mt-5 text-white/70">
                CanaryTrack is not just a record tool. Our long-term vision is to
                create the world’s most trusted digital infrastructure for canary
                breeders, helping them manage bloodlines, improve decisions, and
                operate with more professionalism.
              </p>
              <p className="mt-4 text-white/70">
                We want to support individual breeders, aviaries, clubs, and
                professional operations with a platform that scales from a few birds
                to large breeding programs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Professional breeding records",
                "Safer lineage decisions",
                "International usability",
                "Scalable breeder operations",
              ].map((item) => (
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

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Who is it for?
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Designed for the full canary breeding world
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Individual Breeders",
              text: "Keep your birds, pairings, nests, and notes organized without spreadsheets.",
            },
            {
              title: "Professional Aviaries",
              text: "Manage larger operations with better visibility into production and performance.",
            },
            {
              title: "Breeding Clubs",
              text: "Support structured record keeping and improve collaboration standards.",
            },
            {
              title: "Future Global Network",
              text: "Prepare for a world where breeder data becomes smarter, safer, and more connected.",
            },
          ].map((audience) => (
            <div
              key={audience.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-lg font-semibold">{audience.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">{audience.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="early-access" className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:px-8 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Early Access
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Join the first breeders shaping CanaryTrack
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Leave your email and be among the first to test CanaryTrack, give
            feedback, and help shape the future of canary breeding technology.
          </p>

          <form className="mx-auto mt-10 flex max-w-2xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none placeholder:text-white/35 focus:border-emerald-400/40"
            />
            <button
              type="submit"
              className="h-14 rounded-2xl bg-white px-6 font-semibold text-black transition hover:bg-white/90"
            >
              Request Access
            </button>
          </form>

          <p className="mt-4 text-xs text-white/40">
            No spam. Just product updates, early access invitations, and launch news.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-white/50 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <span className="font-semibold text-white">CanaryTrack</span> — Global
            Canary Breeding Management Platform
          </div>
          <div>© 2026 CanaryTrack. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}