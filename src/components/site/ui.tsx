import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/**
 * Standard page: blue header (breadcrumb, optional eyebrow tag, title, subtitle, action)
 * over a light body, like the results and checkout pages. The breadcrumb names the page
 * with `crumb`, or the title when there's none.
 */
export function PageShell({
  title,
  eyebrow,
  crumb,
  subtitle,
  action,
  children,
}: {
  title: string;
  eyebrow?: string | undefined;
  crumb?: string | undefined;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] bg-secondary/40 pb-20">
      <div className="relative overflow-hidden bg-linear-to-r from-primary to-sky-500 px-4 pb-8 pt-5 text-white sm:px-6 sm:pb-10 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.14)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]"
        />
        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1 text-xs">
            <Link to="/" className="shrink-0 text-white/80 hover:text-white hover:underline">
              Home
            </Link>
            <ChevronRight className="size-3.5 shrink-0 text-white/60" />
            <span aria-current="page" className="truncate font-medium">
              {crumb ?? title}
            </span>
          </nav>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0 max-w-3xl">
              {eyebrow ? (
                <span className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  {eyebrow}
                </span>
              ) : null}
              <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-sm text-white/85 sm:text-base">{subtitle}</p>
              ) : null}
            </div>
            {action}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
    </div>
  );
}

/** Navy closing band with a heading, a line of text and up to two buttons. */
export function CtaBand({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-navy to-primary p-6 text-white shadow-lux sm:p-8">
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-xl font-bold sm:text-2xl">{title}</p>
          <p className="mt-1 text-sm text-white/80">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">{children}</div>
      </div>
    </div>
  );
}

/** Button styles for CtaBand and other navy or blue surfaces. */
export const ctaPrimaryCls =
  "inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-bold text-gold-foreground transition hover:brightness-110";
export const ctaOutlineCls =
  "inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-card sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-display text-xl font-semibold text-navy">{children}</h2>;
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="font-display text-2xl font-semibold text-navy">{value}</p>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  placeholder,
  full,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className={`relative z-20 block ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
      />
    </label>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-navy">
      {children}
    </span>
  );
}
