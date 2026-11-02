import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  Star,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { AgentAvatar } from "@/components/site/ui";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/brand";
import { FLIGHT_SEARCH_ID } from "@/lib/focus-search";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { next?: string | undefined } => {
    const raw = typeof search["next"] === "string" ? search["next"] : "";
    return { next: raw.startsWith("/") && !raw.startsWith("//") ? raw : "" };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Travellers & Agents | FaresDream" },
      {
        name: "description",
        content:
          "Sign in to manage trips, wallet credits, loyalty status and agent net fares on FaresDream.",
      },
      { property: "og:title", content: "Sign in to FaresDream" },
      {
        property: "og:description",
        content: "Access My Trips, wallet credits and the agent portal.",
      },
    ],
  }),
  component: AuthPage,
});

const ADMIN_EMAIL = "rjvtravels8@gmail.com";

const PERKS: { icon: LucideIcon; text: string }[] = [
  { icon: Briefcase, text: "All your trips in one place" },
  { icon: Star, text: "Wallet credits and loyalty status" },
  { icon: Bell, text: "Saved searches and price alerts" },
  { icon: Users, text: "The agent portal, for travel agents" },
];

/** The sign-in service's common errors, in plainer words; anything else passes through. */
function friendlyError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "That email or password isn't right. Check them and try again.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirm your email first, using the link we sent you.";
  }
  if (m.includes("already registered")) {
    return "That email already has an account. Sign in instead.";
  }
  return message;
}

const inputCls =
  "h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-[15px] text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({
  label,
  icon: Icon,
  hint,
  children,
}: {
  label: string;
  icon: LucideIcon;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="relative mt-1.5 block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
        {children}
      </span>
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1A12 12 0 0 0 12 24z"
      />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.2a12 12 0 0 0 0 10.8l4.1-3.1z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const afterAuth = () => {
    if (next) void navigate({ to: next });
    else void navigate({ to: "/dashboard" });
  };
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const signingUp = mode === "signup";

  const fail = (text: string) => setNotice({ kind: "error", text });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    const address = email.trim();
    if (signingUp) {
      const { data, error } = await supabase.auth.signUp({
        email: address,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName.trim() },
        },
      });
      if (error) fail(friendlyError(error.message));
      else if (data.session) afterAuth();
      else {
        setPassword("");
        setNotice({
          kind: "success",
          text: `Almost done. We've sent a confirmation link to ${address}.`,
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: address, password });
      if (error) fail(friendlyError(error.message));
      else if (address.toLowerCase() === ADMIN_EMAIL) navigate({ to: "/admin" });
      else afterAuth();
    }
    setBusy(false);
  }

  async function google() {
    setNotice(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.redirected) return;
    setBusy(false);
    if (result.error) {
      fail("Google sign-in didn't work. Please try again.");
      return;
    }
    afterAuth();
  }

  return (
    <div className="min-h-[100dvh] bg-secondary/40 px-4 pb-28 pt-6 sm:px-6 sm:pt-10 lg:pb-16">
      <div className="mx-auto grid max-w-[960px] overflow-hidden rounded-3xl border border-border bg-card shadow-lux lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <aside className="relative hidden flex-col justify-between gap-8 overflow-hidden bg-linear-to-br from-navy via-primary to-sky-500 p-8 text-white lg:flex xl:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
          />
          <div className="relative">
            <p className="font-display text-2xl font-bold leading-tight">
              Your trips, all in one place
            </p>
            <p className="mt-2 text-sm text-white/80">
              One FaresDream account for everything after you book.
            </p>
            <ul className="mt-7 space-y-4 text-sm">
              {PERKS.map((p) => (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15">
                    <p.icon className="size-[18px]" />
                  </span>
                  {p.text}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={`tel:${PHONE_TEL}`}
            className="relative flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 transition hover:bg-white/15"
          >
            <AgentAvatar className="size-11 bg-white text-primary" />
            <span className="min-w-0 leading-snug">
              <span className="block text-xs text-white/80">Prefer to talk? We're here 24/7</span>
              <span className="block font-display text-[15px] font-bold">{PHONE_DISPLAY}</span>
            </span>
          </a>
        </aside>

        <div className="p-5 sm:p-8 xl:p-10">
          <h1 className="font-display text-2xl font-bold text-navy sm:text-[28px]">
            {signingUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {signingUp
              ? "It's free, and takes less than a minute."
              : "Sign in to see your trips and account."}
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-full bg-secondary p-1 text-sm font-semibold">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => {
                  setMode(m);
                  setNotice(null);
                }}
                className={`rounded-full px-4 py-2 transition ${
                  mode === m
                    ? "bg-card text-navy shadow-card"
                    : "text-muted-foreground hover:text-navy"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-[15px] font-semibold text-foreground transition hover:border-primary/40 hover:bg-secondary/50 disabled:opacity-60"
          >
            <GoogleLogo /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or use your email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {signingUp ? (
              <Field label="Full name" icon={User}>
                <input
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className={inputCls}
                />
              </Field>
            ) : null}

            <Field label="Email" icon={Mail}>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={inputCls}
              />
            </Field>

            <Field
              label="Password"
              icon={Lock}
              {...(signingUp ? { hint: "At least 6 characters." } : {})}
            >
              <input
                required
                type={showPassword ? "text" : "password"}
                autoComplete={signingUp ? "new-password" : "current-password"}
                {...(signingUp ? { minLength: 6 } : {})}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-navy"
              >
                {showPassword ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            </Field>

            {notice ? (
              <p
                role={notice.kind === "error" ? "alert" : "status"}
                className={`flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-sm ${
                  notice.kind === "error"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                {notice.kind === "error" ? (
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                )}
                {notice.text}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold font-display text-base font-bold text-gold-foreground transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-5 animate-spin" /> : null}
              {signingUp ? "Create account" : "Sign in"}
            </button>
          </form>

          {signingUp ? (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link to="/terms" className="font-medium text-navy underline underline-offset-2">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium text-navy underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          ) : null}

          <p className="mt-5 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            Just booking a flight? You don't need an account.{" "}
            <Link
              to="/"
              hash={FLIGHT_SEARCH_ID}
              className="font-semibold text-primary hover:underline"
            >
              Search flights
            </Link>
          </p>

          <a
            href={`tel:${PHONE_TEL}`}
            className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-navy lg:hidden"
          >
            <Phone className="size-4 text-primary" /> Need help? {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </div>
  );
}
