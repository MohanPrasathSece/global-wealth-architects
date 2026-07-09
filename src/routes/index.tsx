import React, { useState, useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import heroStack from "@/assets/hero-stack.jpg";
import logoAssetOffice from "../assets/logo asset office.png";
import { useAuth } from "../context/AuthContext";
import { AuthModals } from "../components/AuthModals";
import { validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
import { CountrySelect } from "../components/CountrySelect";

export const Route = createFileRoute("/")({
  component: Index,
});

function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

function Index() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  const openAuth = (view: "login" | "signup") => {
    setAuthView(view);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-clip pt-4">
      <Nav onOpenAuth={openAuth} />
      <ScrollSection>
        <Hero onOpenAuth={openAuth} />
      </ScrollSection>
      <ScrollSection>
        <Philosophy />
      </ScrollSection>
      <ScrollSection>
        <ProcessTrust />
      </ScrollSection>
      <ScrollSection>
        <ContactFooter />
      </ScrollSection>
      {isAuthModalOpen && (
        <AuthModals
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialView={authView}
          onSuccess={() => navigate({ to: "/dashboard" })}
        />
      )}
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ onOpenAuth }: { onOpenAuth: (view: "login" | "signup") => void }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full z-50 px-4">
      <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border-2 border-ink bg-cream px-6 py-3 shadow-[4px_4px_0_0_var(--ink)]">
        <a href="#" className="flex items-center gap-2">
          <img src={logoAssetOffice} alt="The Asset Office Logo" className="h-7 w-auto object-contain" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">The Asset Office</span>
        </a>
        <div className="hidden items-center gap-8 md:flex text-sm font-bold text-ink">
          <a href="#philosophy" className="hover:text-coral transition-colors">How we think</a>
          <a href="#trust" className="hover:text-coral transition-colors">How it works</a>
          <a href="#contact" className="hover:text-coral transition-colors">Get in</a>
          {user && (
            <Link to="/dashboard" className="hover:text-coral transition-colors">Dashboard</Link>
          )}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs text-ink/75 hover:text-cream bg-cream hover:bg-coral border-2 border-ink rounded-full px-4 py-1.5 transition cursor-pointer font-bold shadow-[2px_2px_0_0_var(--ink)]"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-xs text-cream hover:bg-coral bg-ink border-2 border-ink rounded-full px-4 py-1.5 transition cursor-pointer font-bold shadow-[2px_2px_0_0_var(--ink)]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onOpenAuth("login")}
                className="flex items-center gap-1.5 text-xs text-ink/75 hover:text-cream bg-cream hover:bg-coral border-2 border-ink rounded-full px-4 py-1.5 transition cursor-pointer font-bold shadow-[2px_2px_0_0_var(--ink)]"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth("signup")}
                className="flex items-center gap-1.5 text-xs text-cream hover:bg-coral bg-ink border-2 border-ink rounded-full px-4 py-1.5 transition cursor-pointer font-bold shadow-[2px_2px_0_0_var(--ink)]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden items-center justify-center p-1.5 rounded-full border-2 border-ink bg-cream text-ink hover:bg-coral hover:text-cream transition cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Mobile Full Screen Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-cream flex flex-col justify-between p-8 md:hidden overflow-y-auto">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logoAssetOffice} alt="The Asset Office Logo" className="h-7 w-auto object-contain" />
                <span className="font-display text-lg font-semibold tracking-tight text-ink">The Asset Office</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full border-2 border-ink bg-cream text-ink hover:bg-coral hover:text-cream transition cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Center Links */}
            <div className="flex flex-col items-center justify-center flex-1 my-12 text-center text-3xl font-display font-bold text-ink space-y-6">
              <a
                href="#philosophy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-coral transition-colors py-2"
              >
                How we think
              </a>
              <a
                href="#trust"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-coral transition-colors py-2"
              >
                How it works
              </a>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-coral transition-colors py-2"
              >
                Get in
              </a>
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-coral transition-colors py-2"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Bottom Row */}
            <div className="w-full space-y-3 pt-6 border-t-2 border-ink/10">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center rounded-full border-2 border-ink bg-cream py-3.5 text-sm font-bold text-ink hover:bg-ink hover:text-cream transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full bg-ink py-3.5 text-sm font-bold text-cream hover:bg-coral transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onOpenAuth("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full border-2 border-ink bg-cream py-3.5 text-sm font-bold text-ink hover:bg-ink hover:text-cream transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth("signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center rounded-full bg-ink py-3.5 text-sm font-bold text-cream hover:bg-coral transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ onOpenAuth }: { onOpenAuth: (view: "login" | "signup") => void }) {
  const { user } = useAuth();

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-8 pb-24 md:pt-14 md:pb-32">
      <div className="grid gap-14 md:grid-cols-12 md:gap-8 items-center">
        <div className="md:col-span-7 relative z-10">
          <span className="chip">
            <span className="size-1.5 rounded-full bg-coral" /> Maximum Security. Relentless Growth.
          </span>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Crypto wealth,
            <br />
            <span className="italic text-coral">secured</span> &amp;{" "}
            <span className="relative inline-block">
              <span className="relative z-10">multiplied.</span>
              <span aria-hidden className="absolute inset-x-0 bottom-1 h-4 bg-lime -z-0 -skew-y-1" />
            </span>
          </h1>
          <p className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed">
            The Asset Office is where smart capital hides. We construct battle-tested, institutional-grade crypto allocations for individuals, families, and businesses who want massive growth under unbreakable security.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            {user ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors"
              >
                Go to Dashboard
                <span className="grid size-7 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:rotate-45">→</span>
              </Link>
            ) : (
              <button
                onClick={() => onOpenAuth("signup")}
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors cursor-pointer"
              >
                Start a portfolio
                <span className="grid size-7 place-items-center rounded-full bg-lime text-ink transition-transform group-hover:rotate-45">→</span>
              </button>
            )}
            <a href="#philosophy" className="text-base font-semibold underline decoration-2 underline-offset-4 decoration-coral hover:text-coral">
              Read the philosophy
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-4 max-w-md">
            <Stat k="$420M" v="Capital Advisory" />
            <Stat k="6.4y" v="Average Hold" />
            <Stat k="1,200+" v="Wealth Accounts" />
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
            <p className="font-display italic text-lg">Unbreakable security.</p>
          </div>
          <div className="absolute -bottom-5 -right-5 rounded-2xl border-2 border-ink bg-lime px-4 py-3 shadow-[6px_6px_0_0_var(--ink)] animate-wobble">
            <p className="text-xs font-bold uppercase tracking-widest">relentless compound</p>
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
      title: "Time in the market beats luck.",
      body: "Allocations built for decades, not weeks. Trading is a casino. Cold-blooded compounding wins every single time.",
      bg: "bg-lime",
      shape: <div className="absolute -right-6 -bottom-6 size-32 rounded-full bg-ink/10" />,
    },
    {
      n: "02",
      title: "Boring is highly profitable.",
      body: "Zero leverage. Zero memes. Zero pump-and-dump noise. Relentless capital growth under lock and key.",
      bg: "bg-blush",
      shape: <div className="absolute -left-8 -top-8 size-32 rotate-12 rounded-3xl bg-coral/40" />,
    },
    {
      n: "03",
      title: "Unhackable custody.",
      body: "Insured multi-signature cold storage across three global jurisdictions. Your keys under absolute protection.",
      bg: "bg-cream border-2 border-ink",
      shape: <div className="absolute -right-4 -top-4 size-24 rounded-2xl bg-cobalt/80" />,
    },
    {
      n: "04",
      title: "Flat fee. Zero games.",
      body: "A simple 0.9% annual fee. No hidden spreads, no performance traps, no fine print. Clean.",
      bg: "bg-coral text-cream",
      shape: <div className="absolute -left-4 -bottom-4 size-28 rounded-full bg-lime" />,
    },
  ];

  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-6 py-24 md:py-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="chip">Uncompromising Principles</span>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            We don't <span className="italic text-coral">trade.</span>
            <br />
            We build <span className="italic text-cobalt">empires.</span>
          </h2>
        </div>
        <p className="max-w-sm text-lg text-muted-foreground">
          Four brutal convictions that separate us from the panic. Your capital stays safe, stays locked, and grows while the noise fades away.
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
              The Blueprint to <span className="italic text-lime">Multiply</span>.
            </h2>
          </div>
          <p className="max-w-sm text-lg text-cream/70">
            From onboarding to secure cold-storage custody and relentless compound in three weeks. Bulletproof setup.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-16 grid gap-4 md:grid-cols-4">
          {[
            { n: "01", h: "Onboard", b: "A clean 30-minute alignment on how much capital you want to secure and grow." },
            { n: "02", h: "The Allocation", b: "We design a high-conviction, custom portfolio based on deep protocol security audits." },
            { n: "03", h: "Fort Knox", b: "Your assets move into insured, multi-sig cold storage vaults under your direct ownership." },
            { n: "04", h: "relentless compound", b: "Sit back. We optimize tax lots, execute secure rebalances, and watch your capital compound." },
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
              "I'd looked at six 'wealth' platforms. The Asset Office is the only one that talked me{" "}
              <span className="italic">out</span> of trades. My portfolio is up 3× and I sleep
              through the night."
            </p>
            <footer className="relative mt-8 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-ink text-cream font-display text-lg">M</div>
              <div>
                <div className="font-semibold">Maya Okafor</div>
                <div className="text-sm text-ink/60">Founder, Tallgrass Studio - client since 2021</div>
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("CH");
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const validatePhone = (val: string, countryCode: string = selectedCountry) => {
    return validatePhoneNumber(val, countryCode);
  };

  const validateEmail = (val: string) => {
    if (!val) return "Please enter an email address";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Please enter a valid email address";
    return undefined;
  };

  const validateName = (val: string) => {
    if (!val.trim()) return "Please enter your full name";
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    const nameErr = validateName(form.name);
    const emailErr = validateEmail(form.email);
    const phoneErr = validatePhone(form.phone, selectedCountry);

    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }

    setLoading(true);

    try {
      const fullPhone = formatFullPhoneNumber(form.phone, selectedCountry);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: fullPhone,
          countryCode: selectedCountry,
          message: form.message,
        }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setStatus({
          type: "success",
          msg: "Thank you! Your enquiry has been received successfully.",
        });
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setValidationErrors({});
      } else {
        setStatus({
          type: "error",
          msg: data.error || "An error occurred during submission.",
        });
      }
    } catch (err: unknown) {
      setLoading(false);
      setStatus({ type: "error", msg: "Network error. Please try again." });
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24 md:py-36">
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="chip">Say hi</span>
          <h2 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-6xl">
            Build a portfolio that <span className="italic text-coral">outlasts</span> the cycle.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Tell us about your capital goals. Let's secure it, compound it, and multiply your wealth with absolute security and institutional precision.
          </p>
        </div>

        <form
          className="lg:col-span-3 rounded-[2rem] sm:rounded-[2.5rem] border-2 border-ink bg-cream p-5 sm:p-8 md:p-10 shadow-[6px_6px_0_0_var(--ink)] sm:shadow-[10px_10px_0_0_var(--ink)]"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
                Your Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                }}
                className={`w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base ${validationErrors.name ? "border-coral bg-coral/5" : ""}`}
                placeholder="Priya Shah"
              />
              {validationErrors.name && (
                <p className="text-xs text-coral mt-1 font-semibold">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                }}
                className={`w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base ${validationErrors.email ? "border-coral bg-coral/5" : ""}`}
                placeholder="you@work.com"
              />
              {validationErrors.email && (
                <p className="text-xs text-coral mt-1 font-semibold">{validationErrors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
              Phone Number
            </label>
            <div className="flex gap-2">
              <CountrySelect
                value={selectedCountry}
                onChange={(newCountry) => {
                  setSelectedCountry(newCountry);
                  setValidationErrors((prev) => ({ ...prev, phone: validatePhone(form.phone, newCountry) }));
                }}
              />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, phone: validatePhone(e.target.value, selectedCountry) }));
                }}
                placeholder={getCountry(selectedCountry).placeholder}
                className={`flex-1 rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base ${validationErrors.phone ? "border-coral bg-coral/5" : ""}`}
              />
            </div>
            {validationErrors.phone && (
              <p className="text-xs text-coral mt-1 font-semibold">{validationErrors.phone}</p>
            )}
          </div>

          <div className="mt-5">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-widest text-ink">Anything we should know?</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="I've been holding BTC since 2017 and want to diversify without losing my mind…"
                className="mt-2 w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base focus:outline-none focus:border-coral focus:bg-white transition text-ink"
              />
            </label>
          </div>

          {status && (
            <div className={`mt-4 rounded-xl border p-4 text-sm leading-relaxed ${status.type === "success" ? "border-green-400/20 bg-green-400/10 text-green-700" : "border-red-400/20 bg-red-400/10 text-red-700"}`}>
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors group cursor-pointer"
          >
            {loading ? "Sending..." : "Send it over"}
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
          <p className="font-display text-[15vw] leading-none tracking-tighter md:text-[10rem]">
            asset office<span className="text-coral">.</span>
          </p>
          <div className="text-right text-xs uppercase tracking-widest text-muted-foreground space-y-1">
            <div className="flex justify-end gap-3 mb-2 text-ink/75 font-semibold font-sans normal-case">
              <Link to="/privacy" className="hover:text-coral transition">Privacy Policy</Link>
              <span>·</span>
              <Link to="/terms" className="hover:text-coral transition">Terms & Conditions</Link>
            </div>
            <p>© 2026 The Asset Office, PBC</p>
            <p>SEC registered investment advisor</p>
            <p>Made with patience in California</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base focus:outline-none focus:border-coral focus:bg-white transition"
      />
    </label>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative block text-left" ref={dropdownRef}>
      <span className="text-xs font-bold uppercase tracking-widest text-ink/75">{label}</span>
      <div className="relative mt-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 text-base text-ink outline-none transition cursor-pointer select-none text-left ${isOpen ? "border-coral" : ""}`}
        >
          <span>{value || options[0]}</span>
          <svg
            className={`h-4 w-4 text-ink/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border-2 border-ink bg-cream p-1.5 shadow-[6px_6px_0_0_var(--ink)]">
            <div className="space-y-1">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2 text-sm font-semibold transition cursor-pointer ${
                    value === option
                      ? "bg-ink text-cream"
                      : "text-ink hover:bg-ink/5"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
