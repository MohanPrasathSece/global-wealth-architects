import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { COUNTRIES, validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
import { CountrySelect } from "../components/CountrySelect";
import logoAssetOffice from "../assets/logo asset office.png";
import {
  TrendingUp,
  LogOut,
  Sparkles,
  Zap,
  Activity,
  ArrowUpRight,
  Shield,
  Layers,
  Cpu,
  Mail,
  Phone,
  User,
  MessageSquare
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img src={logoAssetOffice} alt="The Asset Office Logo" className="h-7 w-auto object-contain" />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">The Asset Office</span>
    </div>
  );
}

/* ---------------- REUSABLE SCROLL REVEAL WRAPPER ---------------- */
function ScrollSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true);
          gsap.fromTo(
            el,
            { y: 30, opacity: 0, filter: "blur(6px)" },
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power3.out" }
          );
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fade in dashboard initial container
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );
    }
  }, []);

  if (!user) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-28 pb-20">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(242,120,75,0.06),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(144,238,144,0.06),transparent_50%)]" />

      {/* Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border-2 border-ink bg-cream px-6 py-3 shadow-[4px_4px_0_0_var(--ink)]">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full border border-ink/20 bg-cream/50 px-3 py-1 text-ink/80 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-coral animate-pulse" />
              {user.email}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-ink/75 hover:text-cream bg-cream hover:bg-coral border-2 border-ink rounded-full px-4 py-1.5 transition cursor-pointer font-bold shadow-[2px_2px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_0_var(--ink)]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-6 space-y-24">
        {/* 1. HERO GREETING SECTION */}
        <ScrollSection className="text-center mt-10">
          <div className="mb-4 chip">
            <Sparkles className="h-3.5 w-3.5 text-coral" /> Command Center
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight">
            Your terminal is live, <span className="italic text-coral">{user.name}</span>
          </h1>
          <p className="mt-4 text-ink/70 max-w-xl mx-auto text-base leading-relaxed">
            No speculative gambling, no sleepless nights. Monitor your cold custody, adjust allocations, and guard your wealth with unbreakable security.
          </p>
        </ScrollSection>

        {/* 2. HOW WE GROW YOUR CAPITAL */}
        <ScrollSection>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="chip">
                01 · Smart Staking
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-ink">
                Relentless <span className="italic text-coral">compounding</span>. Zero trading.
              </h2>
              <p className="text-ink/70 leading-relaxed">
                We do not speculate. We route your capital to audited node networks, validators, and delta-neutral liquidity vaults that print consistent yield under lock and key.
              </p>
              <div className="space-y-4">
                {[
                  {
                    t: "Automated Compounding",
                    d: "Earnings are automatically reinvested daily to maximize compound interest."
                  },
                  {
                    t: "Constant Optimization",
                    d: "Funds are dynamically routed 24/7 to the safest high-yield options."
                  },
                  {
                    t: "Zero Leverage Speculation",
                    d: "We do not trade directional assets; your returns come from liquidity premiums."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime border border-ink text-ink font-bold text-[10px]">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-ink">{item.t}</h4>
                      <p className="text-ink/75 leading-relaxed mt-1 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 w-full">
              <CapitalAllocationEngine />
            </div>
          </div>
        </ScrollSection>

        {/* 3. WHY YOUR MONEY IS SAFE */}
        <ScrollSection>
          <div className="text-center space-y-4 mb-16">
            <div className="chip">
              02 · Risk Management
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-ink">
              Why Your <span className="italic text-cobalt">Money is Safe</span>
            </h2>
            <p className="text-ink/70 max-w-xl mx-auto">
              Your capital is protected by institutional multi-party computation vaults, absolute hedging models, and automated volatility stop-locks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Multi-Signature Vaults",
                desc: "We route all deposits through multi-party computation (MPC) cold custody vaults. No single key or individual can access or withdraw your funds.",
                icon: <Shield className="h-6 w-6 text-coral" />,
                badge: "Custody Layer"
              },
              {
                t: "Automated Loss Caps",
                desc: "If system parameters trigger unexpected market adjustments, automated stop-locks instantly convert assets back to secured stablecoins.",
                icon: <Cpu className="h-6 w-6 text-cobalt" />,
                badge: "Safety Protocol"
              },
              {
                t: "Delta-Neutral Strategies",
                desc: "By maintaining balanced directional exposure, your yield is generated from trading volumes rather than the volatile prices of crypto tokens.",
                icon: <Layers className="h-6 w-6 text-lime" />,
                badge: "Hedging Model"
              }
            ].map((prod, i) => (
              <div key={i} className="rounded-3xl border-2 border-ink bg-cream p-6 text-left flex flex-col justify-between h-full space-y-6 shadow-[6px_6px_0_0_var(--ink)] hover:translate-y-[-4px] hover:shadow-[10px_10px_0_0_var(--ink)] transition-all duration-300 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-2xl border-2 border-ink bg-white">
                      {prod.icon}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-ink/70 px-2.5 py-1 rounded-full bg-white border border-ink/20 font-mono">
                      {prod.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-ink group-hover:text-coral transition-colors">{prod.t}</h3>
                  <p className="text-sm text-ink/75 leading-relaxed mt-2">{prod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollSection>

        {/* 4. REAL-TIME TRANSACTIONS */}
        <ScrollSection>
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 w-full">
              <LiveYieldLedger />
            </div>

            <div className="lg:col-span-5 text-left space-y-6">
              <div className="chip">
                03 · Yield Harvesting
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-ink">
                Live Compound <span className="italic text-cobalt">Streams</span>
              </h2>
              <p className="text-ink/70 leading-relaxed">
                Watch your balance print rewards. Monitor live network fees, staking yield, and arbitrage captures compounding into your secure vault.
              </p>
            </div>
          </div>
        </ScrollSection>

        {/* 5. CONTACT / ENQUIRY FORM SECTION */}
        <ScrollSection className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="chip">
              04 · Consultation Desk
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-ink">
              Secure Allocation <span className="italic text-coral">Desk</span>
            </h2>
            <p className="text-ink/70 max-w-lg mx-auto">
              Need a custom high-conviction blueprint or bespoke vaults? Submit your goals and our desk will align with you in 24 hours.
            </p>
          </div>

          <ContactEnquiryLoggedIn
            initialName={user.name}
            initialEmail={user.email}
            initialPhone={user.phone}
          />
        </ScrollSection>
      </div>

      {/* Footer */}
      <footer className="relative mt-32 border-t-2 border-ink py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xs text-ink/50 ml-2 font-mono">
              &copy; 2026 &middot; The Asset Office. The Future of Digital Wealth
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-ink/70">
            <Link to="/privacy" className="hover:text-coral transition font-semibold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-coral transition font-semibold">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- CAPITAL ALLOCATION ENGINE ---------------- */
function CapitalAllocationEngine() {
  const initialCandles = [
    { open: 88200, close: 89100, high: 89400, low: 88000, volume: 120 },
    { open: 89100, close: 88700, high: 89300, low: 88500, volume: 95 },
    { open: 88700, close: 89500, high: 89800, low: 88600, volume: 150 },
    { open: 89500, close: 90200, high: 90500, low: 89300, volume: 180 },
    { open: 90200, close: 89800, high: 90400, low: 89600, volume: 110 },
    { open: 89800, close: 90600, high: 90800, low: 89500, volume: 140 },
    { open: 90600, close: 91400, high: 91600, low: 90400, volume: 210 },
    { open: 91400, close: 90900, high: 91500, low: 90700, volume: 130 },
    { open: 90900, close: 91800, high: 92100, low: 90800, volume: 165 },
    { open: 91800, close: 92400, high: 92700, low: 91600, volume: 195 },
    { open: 92400, close: 92900, high: 93200, low: 92200, volume: 240 },
    { open: 92900, close: 93450, high: 93600, low: 92700, volume: 280 }
  ];

  const [candles, setCandles] = useState(initialCandles);
  const [price, setPrice] = useState(93450);
  const [change, setChange] = useState(2.45);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;
        const last = { ...next[lastIndex] };

        // Random price fluctuation
        const delta = Math.round((Math.random() * 120 - 55));
        const newPrice = Math.max(90000, last.close + delta);

        last.close = newPrice;
        if (newPrice > last.high) last.high = newPrice;
        if (newPrice < last.low) last.low = newPrice;
        last.volume += Math.round(Math.random() * 5);

        next[lastIndex] = last;
        setPrice(newPrice);

        // Update overall change percentage
        const pct = ((newPrice - 88200) / 88200) * 100;
        setChange(parseFloat(pct.toFixed(2)));

        // Occasionally add a new candle and pop the first one
        if (Math.random() > 0.82) {
          const newCandle = {
            open: last.close,
            close: last.close,
            high: last.close,
            low: last.close,
            volume: Math.round(Math.random() * 50 + 50)
          };
          return [...next.slice(1), newCandle];
        }

        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  // Compute boundaries for Y scaling
  const prices = candles.flatMap(c => [c.open, c.close, c.high, c.low]);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice;

  const getPercentageY = (val: number) => {
    return 180 - ((val - minPrice) / priceRange) * 140;
  };

  const candleWidth = 24;
  const spacing = 36;
  const startX = 20;

  // Build moving average points path
  const maPoints = candles.map((c, i) => {
    const x = startX + i * spacing + candleWidth / 2;
    const y = getPercentageY((c.open + c.close) / 2);
    return `${x},${y}`;
  });
  const maPath = `M ${maPoints.join(" L ")}`;

  // Find max volume for volume scaling
  const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

  return (
    <div className="rounded-3xl border-2 border-ink bg-cream p-6 md:p-8 space-y-6 text-left relative overflow-hidden h-[420px] flex flex-col justify-between shadow-[8px_8px_0_0_var(--ink)]">
      {/* Header Info */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink tracking-tight flex items-center gap-2">
            <span>BTC/USD Live Terminal</span>
          </h3>
          <p className="text-sm text-ink/65 mt-1">
            Real-time algorithmic trading feeds.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1.5 rounded-full bg-lime border border-ink px-3 py-1 text-xs text-ink font-bold shadow-[2px_2px_0_0_var(--ink)]">
            <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
            LIVE FEEDS
          </span>
          <span className={`text-sm font-mono font-bold mt-1 ${change >= 0 ? "text-green-600 font-extrabold" : "text-coral font-extrabold"}`}>
            ${price.toLocaleString()} ({change >= 0 ? "+" : ""}{change}%)
          </span>
        </div>
      </div>

      {/* Candlestick SVG Container */}
      <div className="relative flex-1 w-full my-2 bg-white/40 rounded-2xl border-2 border-ink/10 overflow-hidden p-2">
        <svg className="w-full h-full" viewBox="0 0 460 220" preserveAspectRatio="none">
          {/* Horizontal grid lines */}
          {[0.25, 0.5, 0.75].map((p, idx) => (
            <line
              key={idx}
              x1="0"
              y1={180 - p * 140}
              x2="460"
              y2={180 - p * 140}
              stroke="var(--ink)"
              strokeOpacity="0.08"
              strokeDasharray="4 4"
            />
          ))}

          {/* Render volume bars */}
          {candles.map((c, i) => {
            const isGreen = c.close >= c.open;
            const x = startX + i * spacing;
            const volHeight = (c.volume / maxVolume) * 25;
            const y = 210 - volHeight;
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={candleWidth}
                height={volHeight}
                fill={isGreen ? "var(--color-lime)" : "var(--color-coral)"}
                fillOpacity="0.25"
                stroke="var(--ink)"
                strokeOpacity="0.1"
                strokeWidth="1"
                rx="1"
              />
            );
          })}

          {/* Render candles (wick + body) */}
          {candles.map((c, i) => {
            const isGreen = c.close >= c.open;
            const x = startX + i * spacing;
            const centerX = x + candleWidth / 2;

            const yOpen = getPercentageY(c.open);
            const yClose = getPercentageY(c.close);
            const yHigh = getPercentageY(c.high);
            const yLow = getPercentageY(c.low);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyBottom = Math.max(yOpen, yClose);
            const bodyHeight = Math.max(2, bodyBottom - bodyTop);

            return (
              <g key={`candle-${i}`}>
                {/* Wick */}
                <line
                  x1={centerX}
                  y1={yHigh}
                  x2={centerX}
                  y2={yLow}
                  stroke="var(--ink)"
                  strokeWidth="2"
                />
                {/* Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isGreen ? "var(--color-lime)" : "var(--color-coral)"}
                  stroke="var(--ink)"
                  strokeWidth="2"
                  rx="3"
                />
              </g>
            );
          })}

          {/* Moving Average Line */}
          <path
            d={maPath}
            fill="none"
            stroke="var(--color-cobalt)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-2 border-t-2 border-ink/10 pt-4 text-center z-10 font-mono">
        <div>
          <span className="text-[9px] text-ink/50 uppercase font-bold block">Avg Vol (24h)</span>
          <span className="text-xs font-bold text-ink mt-0.5 block">1,845 BTC</span>
        </div>
        <div>
          <span className="text-[9px] text-ink/50 uppercase font-bold block">Terminal State</span>
          <span className="text-xs font-bold text-coral mt-0.5 block">Insured</span>
        </div>
        <div>
          <span className="text-[9px] text-ink/50 uppercase font-bold block">Volatility Index</span>
          <span className="text-xs font-bold text-cobalt mt-0.5 block">Low Risk</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DYNAMIC MINI CHART ---------------- */
function DynamicMiniChart() {
  const [points, setPoints] = useState([30, 35, 32, 40, 38, 45, 42, 50, 48, 55, 52, 60, 58, 65, 62, 70]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const nextPoint = Math.max(10, Math.min(90, prev[prev.length - 1] + (Math.random() * 12 - 5)));
        return [...prev.slice(1), nextPoint];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const w = 140, h = 30;
  const max = 100;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${h - (p / max) * h}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-28 overflow-visible">
      <defs>
        <linearGradient id="chart-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-coral)" />
          <stop offset="50%" stopColor="var(--color-cobalt)" />
          <stop offset="100%" stopColor="var(--color-lime)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="url(#chart-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulse dot at the end */}
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="3"
        fill="var(--color-coral)"
        className="animate-ping"
      />
      <circle
        cx={w}
        cy={h - (points[points.length - 1] / max) * h}
        r="2"
        fill="var(--color-coral)"
      />
    </svg>
  );
}

/* ---------------- LIVE YIELD LEDGER & ARBITRAGE FEED ---------------- */
function LiveYieldLedger() {
  const [balance, setBalance] = useState(1482.41098);
  const [events, setEvents] = useState([
    { id: 1, type: "arbitrage", label: "SOL/USDC Arbitrage capture on Orca", value: "+$84.12", time: "Just now" },
    { id: 2, type: "staking", label: "Auto-compounded Aave ETH lending yield", value: "+0.0042 ETH", time: "1m ago" },
    { id: 3, type: "mint", label: "Liquidity premium swap pool yield harvested", value: "+$12.09", time: "3m ago" },
  ]);

  // Live balance ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + (Math.random() * 0.00035 + 0.00005));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Live ledger events rolling
  useEffect(() => {
    const eventPool = [
      { type: "arbitrage", label: "BTC/USDT triangular trade arbitrage captured", value: "+$144.50" },
      { type: "staking", label: "Liquid restaking rewards compounded (Eigen)", value: "+0.0091 ETH" },
      { type: "mint", label: "Lido staked ETH rewards auto-reinvested", value: "+0.0035 stETH" },
      { type: "arbitrage", label: "SOL/ETH spread arbitrage locked on Jupiter", value: "+$42.80" },
      { type: "staking", label: "Rocket Pool node yield harvested", value: "+0.0019 rETH" },
      { type: "mint", label: "Stablecoin pool rebalancing rewards unlocked", value: "+$8.44" },
    ];

    const interval = setInterval(() => {
      const randomEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
      setEvents((prev) => {
        const nextId = prev[0].id + 1;
        const newEvent = { ...randomEvent, id: nextId, time: "Just now" };
        const updatedPrev = prev.map((e, idx) => ({
          ...e,
          time: idx === 0 ? "1m ago" : `${idx + 1}m ago`,
        }));
        return [newEvent, ...updatedPrev.slice(0, 2)];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-3xl border-2 border-ink bg-cream p-6 relative overflow-hidden h-[300px] flex flex-col justify-between text-left shadow-[8px_8px_0_0_var(--ink)]">
      {/* Header */}
      <div className="flex justify-between items-center z-10 border-b border-ink/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-coral animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-wider text-ink/60 font-mono">Algorithmic Yield Stream</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-lime border border-ink px-2.5 py-0.5 text-[9px] font-bold text-ink shadow-[2px_2px_0_0_var(--ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-ink animate-ping" />
          LIVE LEDGER
        </div>
      </div>

      {/* Main Stats / Ticker */}
      <div className="my-3 z-10 flex justify-between items-end">
        <div>
          <span className="text-[10px] uppercase font-bold text-ink/40 block font-mono">Accrued Profit (Real-Time)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-ink font-mono tracking-tight">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
            </span>
            <span className="text-[10px] text-coral font-bold animate-pulse font-mono">+0.02%/min</span>
          </div>
        </div>
        <div>
          <DynamicMiniChart />
        </div>
      </div>

      {/* Live Event Stream Feed */}
      <div className="flex-1 space-y-2 z-10 overflow-hidden relative mt-2">
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 border-2 border-ink/10 hover:border-ink transition-all"
          >
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${e.type === "arbitrage" ? "bg-coral" : e.type === "staking" ? "bg-cobalt" : "bg-lime"}`} />
              <div className="text-left">
                <div className="text-[11px] font-semibold text-ink/80 line-clamp-1">{e.label}</div>
                <div className="text-[8px] text-ink/40 font-mono">{e.time}</div>
              </div>
            </div>
            <div className="text-[11px] font-bold text-coral text-right shrink-0 ml-2 font-mono">
              {e.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LOGGED-IN PAGE CONTACT FORM ---------------- */
function ContactEnquiryLoggedIn({
  initialName,
  initialEmail,
  initialPhone,
}: {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}) {
  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    phone: initialPhone,
    message: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("CH");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Storage states
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setUploadedFileUrl(data.fileUrl);
    } catch (err: any) {
      setUploadError(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

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
        body: JSON.stringify({ ...form, phone: fullPhone, countryCode: selectedCountry, fileUrl: uploadedFileUrl }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setStatus({
          type: "success",
          msg: "Thank you! Your enquiry has been received successfully.",
        });
        setForm({ ...form, message: "" });
        setUploadedFileUrl(null);
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
    <div className="rounded-[2.5rem] border-2 border-ink bg-cream p-8 md:p-10 shadow-[10px_10px_0_0_var(--ink)] text-left relative">
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                }}
                className={`w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base ${validationErrors.name ? "border-coral bg-coral/5" : ""}`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-xs text-coral mt-1 font-semibold">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                }}
                className={`w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base ${validationErrors.email ? "border-coral bg-coral/5" : ""}`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-coral mt-1 font-semibold">{validationErrors.email}</p>
            )}
          </div>
        </div>

        <div>
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

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
            Message (Optional)
          </label>
          <textarea
            rows={4}
            placeholder="Outline your investment goals…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full resize-none rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-ink/75">
            Upload Document (Optional)
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full rounded-2xl border-2 border-ink bg-white/60 px-4 py-3 outline-none focus:border-coral focus:bg-white transition text-ink text-base file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-2 file:border-ink file:text-xs file:font-bold file:bg-cream file:text-ink file:cursor-pointer hover:file:bg-coral hover:file:text-cream transition-colors duration-200"
            />
            {uploading && <p className="text-xs text-ink/60 font-mono">Uploading file to storage...</p>}
            {uploadError && <p className="text-xs text-coral font-semibold">{uploadError}</p>}
            {uploadedFileUrl && (
              <p className="text-xs text-ink flex items-center gap-1.5 font-semibold">
                <span className="text-green-700 bg-green-100 border border-green-300 rounded px-1.5 py-0.5">✓ File uploaded:</span>
                <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer" className="underline font-mono truncate max-w-xs hover:text-coral">
                  {uploadedFileUrl.split("/").pop()}
                </a>
              </p>
            )}
          </div>
        </div>

        {status && (
          <div
            className={`rounded-2xl border-2 p-4 text-sm leading-relaxed ${status.type === "success" ? "border-ink bg-lime text-ink font-bold" : "border-coral bg-coral/10 text-coral font-semibold"}`}
          >
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink px-6 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer shadow-[4px_4px_0_0_var(--ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0_0_0_0_var(--ink)]"
        >
          {loading ? "Submitting enquiry..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}
