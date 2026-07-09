import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { validatePhoneNumber, formatFullPhoneNumber, getCountry } from "../utils/phoneValidation";
import { CountrySelect } from "./CountrySelect";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
  onSuccess?: () => void;
}

export const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  onClose,
  initialView = "login",
  onSuccess,
}) => {
  const [view, setView] = useState<"login" | "signup">(initialView);
  const { login, signup } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("CH");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const modalRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setView(initialView);
    setError(null);
    setSuccess(null);
    setAlreadyExists(false);
    setNotRegistered(false);
    setEmail("");
    setName("");
    setPhone("");
    setSelectedCountry("CH");
    setValidationErrors({});
  }, [initialView, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (overlayRef.current && modalRef.current) {
        gsap.killTweensOf([overlayRef.current, modalRef.current]);
        gsap.set(overlayRef.current, { opacity: 0 });
        gsap.set(modalRef.current, { scale: 0.92, opacity: 0, y: 20 });
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: "power2.out" });
        gsap.to(modalRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.38, delay: 0.04, ease: "back.out(1.4)" });
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, { scale: 0.94, opacity: 0, y: 10, duration: 0.2, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, delay: 0.04, ease: "power2.in", onComplete: onClose });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // ── Validators ──────────────────────────────────────────────────────────────
  const validateEmail = (val: string) => {
    if (!val?.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return "Invalid email address";
    return undefined;
  };

  const validateName = (val: string) => {
    if (!val?.trim()) return "Full name is required";
    if (val.trim().length < 2) return "At least 2 characters";
    return undefined;
  };

  const validatePhone = (val: string, country?: string) =>
    validatePhoneNumber(val, country ?? selectedCountry);

  // ── Submit handlers ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotRegistered(false);
    const emailErr = validateEmail(email);
    if (emailErr) { setValidationErrors({ email: emailErr }); return; }
    setLoading(true);
    const res = await login(email);
    setLoading(false);
    if (res.success) {
      setSuccess("Welcome back!");
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 800);
    } else if (res.code === "NOT_FOUND") {
      setNotRegistered(true);
    } else {
      setError(res.error || "Login failed. Please try again.");
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone, selectedCountry);
    if (nameErr || emailErr || phoneErr) {
      setValidationErrors({ name: nameErr, email: emailErr, phone: phoneErr });
      return;
    }
    setLoading(true);
    setAlreadyExists(false);
    const fullPhone = formatFullPhoneNumber(phone, selectedCountry);
    const res = await signup(name, email, fullPhone, selectedCountry);
    setLoading(false);
    if (res.success) {
      setSuccess("Account created! Welcome to The Asset Office.");
      setTimeout(() => { handleClose(); if (onSuccess) onSuccess(); }, 1100);
    } else if (res.code === "ALREADY_EXISTS") {
      setAlreadyExists(true);
    } else {
      setError(res.error || "Signup failed. Please try again.");
    }
  };

  // ── Style helpers ────────────────────────────────────────────────────────────
  const input = (err?: string) =>
    `w-full rounded-2xl border-2 ${
      err ? "border-coral bg-coral/5 text-coral focus:border-coral" : "border-ink bg-white/60 text-ink focus:border-coral focus:bg-white"
    } px-4 py-3 text-base outline-none transition placeholder:text-ink/40`;

  const label = "mb-1 block text-xs font-bold uppercase tracking-widest text-ink/70";

  const errText = (msg?: string) =>
    msg ? <p className="text-xs text-coral mt-1 font-semibold">{msg}</p> : null;

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ink/30 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* ── Modal card — centered on every screen size ── */}
      <div
        ref={modalRef}
        className="
          relative z-10
          w-full max-w-[92vw] sm:max-w-[460px]
          rounded-[2rem] border-2 border-ink
          bg-cream shadow-[8px_8px_0_0_var(--ink)]
          overflow-hidden
        "
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Close btn */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 h-8 w-8 flex items-center justify-center rounded-full border-2 border-ink bg-cream hover:bg-coral hover:text-cream text-ink transition text-xs font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Scrollable body */}
        <div className="max-h-[88vh] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8 text-left">

          {view === "login" ? (
            /* ════════════════ LOGIN ════════════════ */
            <div>
              <h3 className="font-display text-3xl font-bold text-ink mb-1">Sign In</h3>
              <p className="text-sm text-ink/65 mb-6">Enter your email to access your account.</p>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                  <label className={label}>Email address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                    placeholder="you@domain.com"
                    className={input(validationErrors.email)}
                  />
                  {errText(validationErrors.email)}
                </div>

                {notRegistered && (
                  <div className="rounded-2xl border-2 border-ink bg-blush p-4 text-sm leading-relaxed text-ink">
                    <p className="font-bold text-coral mb-0.5">⚠️ Account not found</p>
                    <p className="text-ink/80 break-all mb-2">
                      <span className="font-mono text-ink/90 font-bold">{email}</span> is not registered yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setNotRegistered(false);
                        setError(null);
                        setValidationErrors({});
                        setView("signup");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-coral transition-colors cursor-pointer"
                    >
                      → Sign Up instead
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm text-coral leading-relaxed font-semibold">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border-2 border-ink bg-lime px-4 py-3 text-sm text-ink leading-relaxed font-bold">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-ink px-6 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Signing in…" : "Continue →"}
                </button>

                <p className="text-center text-sm text-ink/50 pt-2 font-medium">
                  No account?{" "}
                  <button
                    type="button"
                    onClick={() => { setView("signup"); setError(null); setValidationErrors({}); }}
                    className="text-coral font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>

          ) : (
            /* ════════════════ SIGNUP ════════════════ */
            <div>
              <h3 className="font-display text-3xl font-bold text-ink mb-1">Create Account</h3>
              <p className="text-sm text-ink/65 mb-6">Join The Asset Office and start compounding.</p>

              <form onSubmit={handleSignupSubmit} className="space-y-3.5 sm:space-y-4">

                {/* Full Name */}
                <div>
                  <label className={label}>Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setValidationErrors((p) => ({ ...p, name: validateName(e.target.value) }));
                    }}
                    placeholder="John Doe"
                    className={input(validationErrors.name)}
                  />
                  {errText(validationErrors.name)}
                </div>

                {/* Email */}
                <div>
                  <label className={label}>Email Address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAlreadyExists(false);
                      setValidationErrors((p) => ({ ...p, email: validateEmail(e.target.value) }));
                    }}
                    placeholder="you@domain.com"
                    className={input(validationErrors.email)}
                  />
                  {errText(validationErrors.email)}
                </div>

                {/* Phone */}
                <div>
                  <label className={label}>Phone Number</label>
                  <div className="flex gap-2 items-stretch">
                    <div className="flex-shrink-0">
                      <CountrySelect
                        value={selectedCountry}
                        onChange={(c) => {
                          setSelectedCountry(c);
                          setValidationErrors((p) => ({
                            ...p,
                            phone: phone ? validatePhoneNumber(phone, c) : undefined,
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setValidationErrors((p) => ({ ...p, phone: validatePhone(e.target.value, selectedCountry) }));
                        }}
                        placeholder={getCountry(selectedCountry).placeholder}
                        className={input(validationErrors.phone)}
                      />
                    </div>
                  </div>
                  {errText(validationErrors.phone)}
                </div>

                {/* Already-exists banner */}
                {alreadyExists && (
                  <div className="rounded-2xl border-2 border-ink bg-blush p-4 text-sm leading-relaxed text-ink">
                    <p className="font-bold text-coral mb-0.5">⚠️ Account already exists</p>
                    <p className="text-ink/80 break-all mb-2">
                      <span className="font-mono text-ink/90 font-bold">{email}</span> is already registered.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setAlreadyExists(false);
                        setError(null);
                        setValidationErrors({});
                        setView("login");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-cream hover:bg-coral transition-colors cursor-pointer"
                    >
                      → Sign In instead
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border-2 border-coral bg-coral/10 px-4 py-3 text-sm text-coral leading-relaxed font-semibold">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border-2 border-ink bg-lime px-4 py-3 text-sm text-ink leading-relaxed font-bold">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-ink px-6 py-4 text-base font-semibold text-cream hover:bg-coral transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Creating…" : "Create Account →"}
                </button>

                <p className="text-center text-sm text-ink/50 pt-2 font-medium">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { setView("login"); setError(null); setValidationErrors({}); }}
                    className="text-coral font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
