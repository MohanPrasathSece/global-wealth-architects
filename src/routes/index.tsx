import { createFileRoute } from "@tanstack/react-router";
import heroStack from "@/assets/hero-stack.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { property: "og:image", content: "https://project--ea4fda5c-18af-4d7c-b49f-f240a5460b47.lovable.app/og.jpg" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip">
      <Nav />
      <Hero />
      <Philosophy />
      <ProcessTrust />
      <ContactFooter />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href="#" className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-ink text-cream font-display text-lg font-bold">k</span>
        <span className="font-display text-2xl font-semibold tracking-tight">Kernel</span>
      </a>
      <div className="hidden items-center gap-8 md:flex text-sm font-medium">
        <a href="#philosophy" className="hover:text-coral transition-colors">How we think</a>
        <a href="#trust" className="hover:text-coral transition-colors">How it works</a>
        <a href="#contact" className="hover:text-coral transition-colors">Get in</a>
      </div>
      <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coral transition-colors">
        Talk to a human
        <span aria-hidden>→</span>
      </a>
    </nav>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-24 md:pt-14 md:pb-32">
      <div className="grid gap-14 md:grid-cols-12 md:gap-8 items-center">
        <div className="md:col-span-7 relative z-10">
          <span className="chip">
            <span className="size-1.5 rounded-full bg-coral" /> Boring on purpose since 2019
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Crypto wealth,
            <br />
            <span className="italic text-coral">grown</span> not{" "}
            <span className="relative inline-block">
              <span className="relative z-10">gambled.</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 h-4 bg-lime -z-0 -skew-y-1" />
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
            Kernel builds long-horizon digital asset portfolios for people, families and businesses
            who'd rather compound quietly than refresh a candlestick chart at 3am.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#contact" className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors">
              Start a portfolio
              <span className="grid size-7 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:rotate-45">→</span>
            </a>
            <a href="#philosophy" className="text-base font-semibold underline decoration-2 underline-offset-4 decoration-coral hover:text-coral">
              Read the philosophy
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-4 max-w-md">
            <Stat k="$420M" v="Under advisory" />
            <Stat k="6.4y" v="Avg holding" />
            <Stat k="1 200+" v="Households" />
          </dl>
        </div>

        <div className="md:col-span-5 relative">
          <div className="relative aspect-square rounded-[2.5rem] bg-blush overflow-hidden ring-1 ring-ink/10">
            <img
              src={heroStack}
              alt="Playful 3D stack of coins and geometric shapes representing a long-term crypto portfolio"
              width={1400}
              height={1100}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute -top-6 -left-6 rounded-2xl border-2 border-ink bg-cream px-4 py-3 shadow-[6px_6px_0_0_var(--ink)] animate-floaty">
            <p className="font-display italic text-lg">HODL, refined.</p>
          </div>
          <div className="absolute -bottom-5 -right-5 rounded-2xl border-2 border-ink bg-lime px-4 py-3 shadow-[6px_6px_0_0_var(--ink)] animate-wobble">
            <p className="text-xs font-bold uppercase tracking-widest">+ 34% CAGR · 5yr</p>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-24 -mx-6 overflow-hidden border-y-2 border-ink bg-ink text-cream">
        <div className="flex whitespace-nowrap animate-marquee py-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10 font-display text-3xl">
              <span>Bitcoin</span><Dot />
              <span className="italic text-lime">Ethereum</span><Dot />
              <span>Solana</span><Dot />
              <span className="italic text-coral">Stablecoins</span><Dot />
              <span>Real-world assets</span><Dot />
              <span className="italic">Yield vaults</span><Dot />
              <span>Long-term</span><Dot />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="font-display text-3xl font-semibold md:text-4xl">{k}</dt>
      <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{v}</dd>
    </div>
  );
}

function Dot() {
  return <span aria-hidden className="inline-block size-2 rounded-full bg-lime" />;
}

/* ---------------- PHILOSOPHY ---------------- */
function Philosophy() {
  const cards = [
    {
      n: "01",
      title: "Time in the market beats timing.",
      body: "We build allocations for decades, not weeks. Emotions cost more than fees.",
      bg: "bg-lime",
      shape: <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-ink/10" />,
    },
    {
      n: "02",
      title: "Boring is a feature.",
      body: "No leverage. No memes. No 100x plays. Just quiet, deliberate compounding.",
      bg: "bg-blush",
      shape: <div className="absolute -left-8 -top-8 size-32 rotate-12 rounded-3xl bg-coral/40" />,
    },
    {
      n: "03",
      title: "Custody first, always.",
      body: "Multi-sig cold storage across three jurisdictions. Your keys, our infrastructure.",
      bg: "bg-cream border-2 border-ink",
      shape: <div className="absolute -right-4 -top-4 size-24 rounded-2xl bg-cobalt/80" />,
    },
    {
      n: "04",
      title: "Fees you can explain.",
      body: "One flat 0.9% a year. No spreads. No performance fees. No fine print.",
      bg: "bg-coral text-cream",
      shape: <div className="absolute -left-4 -bottom-4 size-28 rounded-full bg-lime" />,
    },
  ];

  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-6 py-24 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="chip">Why choose Kernel</span>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            We're not <span className="italic text-coral">traders.</span>
            <br />
            We're <span className="italic text-cobalt">gardeners.</span>
          </h2>
        </div>
        <p className="max-w-sm text-lg text-muted-foreground">
          Four convictions that keep us calm when the market isn't. And keep your portfolio
          growing while you get on with your life.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article
            key={c.n}
            className={`relative overflow-hidden rounded-[2rem] p-8 min-h-72 flex flex-col justify-between ring-1 ring-ink/10 ${c.bg}`}
          >
            {c.shape}
            <div className="relative z-10 font-mono text-sm font-bold tracking-widest">{c.n}</div>
            <div className="relative z-10 mt-8">
              <h3 className="font-display text-2xl font-semibold leading-tight">{c.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${c.bg.includes("coral") ? "text-cream/85" : "text-ink/70"}`}>{c.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- PROCESS + TRUST ---------------- */
function ProcessTrust() {
  return (
    <section id="trust" className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="chip !bg-ink !text-cream !border-cream/40">
              <span className="size-1.5 rounded-full bg-lime" /> How it works
            </span>
            <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
              Four steps. No <span className="italic text-lime">spreadsheets</span>.
            </h2>
          </div>
          <p className="max-w-sm text-lg text-cream/70">
            From your first call to a fully allocated portfolio in about three weeks. Yes, really.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-16 grid gap-4 md:grid-cols-4">
          {[
            { n: "01", h: "Say hi", b: "A 30-min call to understand goals, timeline and comfort with risk." },
            { n: "02", h: "Plan", b: "We design an allocation and walk you through every asset and why." },
            { n: "03", h: "Custody", b: "Your assets move into insured multi-sig cold storage in your name." },
            { n: "04", h: "Compound", b: "Quarterly reviews, tax-lot reports, and rebalances when needed." },
          ].map((s, i) => (
            <li key={s.n} className="relative rounded-3xl border border-cream/15 bg-cream/5 p-6 backdrop-blur">
              <div className="font-mono text-xs font-bold tracking-widest text-lime">STEP {s.n}</div>
              <h3 className="mt-3 font-display text-2xl font-semibold">{s.h}</h3>
              <p className="mt-2 text-sm text-cream/70 leading-relaxed">{s.b}</p>
              {i < 3 && (
                <span aria-hidden className="hidden md:block absolute right-[-14px] top-10 text-2xl text-lime">→</span>
              )}
            </li>
          ))}
        </ol>

        {/* Testimonial + Numbers */}
        <div className="mt-20 grid gap-6 lg:grid-cols-5">
          <blockquote className="lg:col-span-3 rounded-[2rem] bg-lime text-ink p-10 md:p-14 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-coral/60" />
            <p className="relative font-display text-3xl leading-tight md:text-4xl">
              "I'd looked at six 'wealth' platforms. Kernel is the only one that talked me{" "}
              <span className="italic">out</span> of trades. My portfolio is up 3× and I sleep
              through the night."
            </p>
            <footer className="relative mt-8 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-ink text-cream font-display text-lg">M</div>
              <div>
                <div className="font-semibold">Maya Okafor</div>
                <div className="text-sm text-ink/60">Founder, Tallgrass Studio — client since 2021</div>
              </div>
            </footer>
          </blockquote>

          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <NumberCard k="0" v="Client keys lost, ever" tone="coral" />
            <NumberCard k="99.8%" v="Cold storage" tone="cream" />
            <NumberCard k="24/7" v="Human support" tone="cobalt" />
            <NumberCard k="A+" v="Audit rating" tone="lime" />
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center gap-3">
          {["SOC 2 Type II", "ISO 27001", "FinCEN registered", "Insured up to $250M", "Independently audited"].map((b) => (
            <span key={b} className="rounded-full border border-cream/25 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-cream/80">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function NumberCard({ k, v, tone }: { k: string; v: string; tone: "coral" | "cream" | "cobalt" | "lime" }) {
  const map = {
    coral: "bg-coral text-cream",
    cream: "bg-cream text-ink",
    cobalt: "bg-cobalt text-cream",
    lime: "bg-lime text-ink",
  };
  return (
    <div className={`rounded-3xl p-6 ${map[tone]}`}>
      <div className="font-display text-4xl font-semibold">{k}</div>
      <div className="mt-2 text-xs font-semibold uppercase tracking-widest opacity-80">{v}</div>
    </div>
  );
}

/* ---------------- CONTACT + FOOTER ---------------- */
function ContactFooter() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="chip">Say hi</span>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-6xl">
            Let's build a portfolio that <span className="italic text-coral">outlives</span> the cycle.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Tell us a bit about you. A real person (hi, that's Priya, Marcus or Jae) will get
            back within one business day.
          </p>

          <div className="mt-10 space-y-4 text-sm">
            <Row label="Email" value="hello@kernel.money" />
            <Row label="Phone" value="+1 (415) 555 0102" />
            <Row label="Offices" value="San Francisco · Lisbon · Singapore" />
          </div>
        </div>

        <form
          className="lg:col-span-3 rounded-[2.5rem] border-2 border-ink bg-cream p-8 md:p-10 shadow-[10px_10px_0_0_var(--ink)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" placeholder="Priya Shah" />
            <Field label="Email" placeholder="you@work.com" type="email" />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <SelectField label="I'm investing as" options={["An individual", "A family", "A business", "An institution"]} />
            <SelectField label="Rough portfolio size" options={["Under $100k", "$100k – $500k", "$500k – $2M", "$2M+"]} />
          </div>
          <div className="mt-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest">Anything we should know?</span>
              <textarea
                rows={4}
                placeholder="I've been holding BTC since 2017 and want to diversify without losing my mind…"
                className="mt-2 w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base focus:outline-none focus:border-coral focus:bg-white transition"
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors group"
          >
            Send it over
            <span className="grid size-7 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:rotate-45">→</span>
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            No newsletters. No cold-calls. Just a conversation.
          </p>
        </form>
      </div>

      {/* Big wordmark */}
      <div className="mt-28 border-t-2 border-ink pt-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-[18vw] leading-none tracking-tighter md:text-[14rem]">
            kernel<span className="text-coral">.</span>
          </p>
          <div className="text-right text-xs uppercase tracking-widest text-muted-foreground space-y-1">
            <p>© 2026 Kernel Capital, PBC</p>
            <p>SEC registered investment advisor</p>
            <p>Made with patience in California</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-ink/10 pb-3">
      <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base focus:outline-none focus:border-coral focus:bg-white transition"
      />
    </label>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      <select className="mt-2 w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base focus:outline-none focus:border-coral focus:bg-white transition">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
