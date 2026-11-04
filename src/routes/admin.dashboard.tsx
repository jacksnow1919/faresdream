import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  adminLogout,
  adminSessionStatus,
  getAdminBookings,
  updateBookingStatus,
  type AdminBookingRow,
} from "@/lib/bookings.functions";
import {
  captureFunds,
  setBookingVerification,
  type StaffRole,
} from "@/lib/staff.functions";
import { LeadsSection } from "@/components/admin/LeadsSection";
import { VerificationSection } from "@/components/admin/VerificationSection";
import { StaffSection } from "@/components/admin/StaffSection";
import { CardRevealModal } from "@/components/admin/CardRevealModal";
import { BookingsSection, SourceBadge, StatusBadge } from "@/components/admin/BookingsSection";
import { PnrQueue } from "@/components/admin/PnrQueue";
import { BookingOpsPanel } from "@/components/admin/BookingOpsPanel";
import { DealsSection } from "@/components/admin/DealsSection";
import { RefundsSection } from "@/components/admin/RefundsSection";
import { ActivitySection } from "@/components/admin/ActivitySection";
import { ProvidersSection } from "@/components/admin/ProvidersSection";
import { bookingSource, canManageProviders, canViewActivity, formatMoney } from "@/lib/admin-logic";
import { providerLabel } from "@/lib/flight-providers";
import {
  LayoutDashboard,
  ShieldCheck,
  ShieldAlert,
  Inbox,
  Link2,
  Ticket,
  TrendingUp,
  Users,
  DollarSign,
  LogOut,
  Loader2,
  X,
  Tag,
  RotateCcw,
  History,
  Server,
} from "lucide-react";


export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — EAZAIR Reconciliation | FaresDream" },
      {
        name: "description",
        content:
          "Data-dense admin dashboard with gross bookings value, net revenue yield, EAZAIR affiliate referrals and checkout conversion tracking.",
      },
      { property: "og:title", content: "Admin Dashboard — Affiliate Reconciliation" },
      {
        property: "og:description",
        content: "Track EAZAIR referral traffic, PNR queue and API health in one console.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

const NAV: {
  label: string;
  hash: string;
  icon: typeof LayoutDashboard;
  show?: (role: StaffRole) => boolean;
}[] = [
  { label: "Overview", hash: "overview", icon: LayoutDashboard },
  { label: "All Bookings", hash: "reconciliation", icon: Link2 },
  { label: "PNR Queue", hash: "pnr-queue", icon: Ticket },
  { label: "Refunds", hash: "refunds", icon: RotateCcw },
  { label: "Deals", hash: "deals", icon: Tag },
  { label: "Leads & Quotes", hash: "leads", icon: Inbox },
  { label: "Verification", hash: "verification", icon: ShieldCheck },
  { label: "Flight APIs", hash: "providers", icon: Server, show: canManageProviders },
  { label: "Activity log", hash: "activity", icon: History, show: canViewActivity },
  { label: "Staff & roles", hash: "staff", icon: Users, show: (r) => r === "superadmin" },
];

/** Status buttons in the details drawer; "refunded" comes from marking a refund paid. */
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending ticketing" },
  { value: "issued", label: "Ticketed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

function Sidebar({ role, onSignOut }: { role: StaffRole; onSignOut: () => void }) {
  return (
    <aside className="bg-navy text-navy-foreground lg:min-h-[100dvh]">
      <div className="px-4 py-5">
        <p className="font-display text-base font-semibold">Mission Control</p>
        <p className="text-[11px] uppercase tracking-widest text-navy-foreground/60">
          FaresDream · {role}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-4 lg:flex-col lg:overflow-visible">
        {NAV.filter((n) => !n.show || n.show(role)).map((n) => (
          <a
            key={n.label}
            href={`#${n.hash}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-foreground/80 transition hover:bg-white/10"
          >
            <n.icon className="size-4" />
            {n.label}
          </a>
        ))}

        <button
          onClick={onSignOut}
          className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy-foreground/80 transition hover:bg-white/10"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </nav>
    </aside>
  );
}

function Kpi({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span className="grid size-8 place-items-center rounded-lg bg-navy text-navy-foreground">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-navy">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="max-w-[60%] text-right text-sm font-semibold text-navy">{value || "—"}</span>
    </div>
  );
}

function DetailsPanel({
  booking,
  role,
  onClose,
  onStatusChange,
  saving,
  statusError,
  onOpsChange,
}: {
  booking: AdminBookingRow;
  role: StaffRole;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  saving: boolean;
  statusError: string;
  onOpsChange: () => void;
}) {
  const queryClient = useQueryClient();
  const verifyFn = useServerFn(setBookingVerification);
  const captureFn = useServerFn(captureFunds);
  const [remarks, setRemarks] = useState(booking.verification_remarks ?? "");
  const [notice, setNotice] = useState("");
  const [revealOpen, setRevealOpen] = useState(false);

  const privileged = role === "manager" || role === "superadmin";
  const isVerified = booking.verification_status === "verified";
  const captured = Boolean(booking.captured_at);

  const verifyMutation = useMutation({
    mutationFn: (status: "verified" | "rejected" | "pending") =>
      verifyFn({ data: { id: booking.id, status, remarks: remarks.trim() } }),
    onSuccess: (res) => {
      setNotice(res.ok ? "" : res.message);
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });

  const captureMutation = useMutation({
    mutationFn: () => captureFn({ data: { id: booking.id } }),
    onSuccess: (res) => {
      setNotice(res.ok ? "Funds captured." : res.message);
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });

  const address = [
    booking.billing_address,
    booking.billing_city,
    booking.billing_postal_code,
    booking.billing_country,
  ]
    .filter(Boolean)
    .join(", ");
  const total = Number(booking.total_price);

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-navy/60" />
      <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-border bg-card p-5 shadow-lux">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">
              Booking details
            </p>
            <h2 className="font-display text-xl font-semibold text-navy">
              {booking.pnr ?? "No PNR"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3">
          <SourceBadge source={bookingSource(booking)} />
        </div>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-navy">Passenger contact</h3>
          <div className="mt-1.5">
            <Row label="Name" value={booking.lead_name ?? ""} />
            <Row label="Email" value={booking.guest_email ?? ""} />
            <Row label="Phone" value={booking.guest_phone ?? ""} />
            <Row label="Billing address" value={address} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-navy">Flight details</h3>
          <div className="mt-1.5">
            <Row label="PNR" value={booking.pnr ?? ""} />
            <Row label="Route" value={`${booking.origin} → ${booking.destination}`} />
            <Row label="Airline" value={booking.airline ?? ""} />
            <Row label="Flight API" value={providerLabel(booking.fare_provider)} />
            <Row label="Cabin" value={booking.cabin_class ?? ""} />
            <Row label="Travel date" value={booking.depart_date ?? ""} />
            <Row label="Return" value={booking.return_date ?? ""} />
            <Row label="Booked on" value={new Date(booking.created_at).toLocaleString()} />
          </div>
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-navy">Financials</h3>
          <div className="mt-1.5">
            <Row
              label="Total price"
              value={formatMoney(total, booking.currency)}
            />
            <Row label="Promo code" value={booking.promo_code ?? ""} />
            <Row
              label="Promo discount"
              value={formatMoney(Number(booking.promo_discount), booking.currency)}
            />
            <Row
              label="Commission (12% yield)"
              value={formatMoney(Math.round(total * 0.12), booking.currency)}
            />
            <Row label="Click ID" value={booking.click_id ?? ""} />
          </div>
        </section>

        <section className="mt-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold text-navy">Status</h3>
            <StatusBadge status={booking.status} />
          </div>
          {booking.status === "refunded" ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Refunded and closed. The status can't be changed any more.
            </p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => {
                const active = booking.status === s.value;
                return (
                  <button
                    key={s.value}
                    disabled={saving || active}
                    onClick={() => onStatusChange(s.value)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold transition disabled:opacity-70 ${
                      active
                        ? "bg-navy text-navy-foreground"
                        : "border border-border bg-background text-navy hover:border-gold"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
          {saving ? (
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Saving…
            </p>
          ) : null}
          {statusError ? (
            <p role="alert" className="mt-2 text-xs font-semibold text-destructive">
              {statusError}
            </p>
          ) : null}
        </section>

        <BookingOpsPanel key={booking.id} booking={booking} role={role} onChange={onOpsChange} />

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-navy">Payment card</h3>
          <div className="mt-1.5">
            <Row
              label="Vaulted card"
              value={
                booking.card_last4
                  ? `${booking.card_brand ?? "Card"} •••• •••• •••• ${booking.card_last4}`
                  : "No card vaulted"
              }
            />
          </div>
          {booking.card_last4 && privileged ? (
            <button
              onClick={() => setRevealOpen(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-destructive/40 px-3 py-2 text-xs font-bold text-destructive"
            >
              <ShieldAlert className="size-3.5" /> Break-glass reveal
            </button>
          ) : booking.card_last4 ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Card numbers stay masked for the agent role.
            </p>
          ) : null}
        </section>

        <section className="mt-5">
          <h3 className="font-display text-sm font-semibold text-navy">Verification &amp; capture</h3>
          <p className="mt-1 text-xs">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                isVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : booking.verification_status === "rejected"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-gold/15 text-navy ring-1 ring-gold/40"
              }`}
            >
              {(booking.verification_status ?? "pending").toUpperCase()}
            </span>
            {booking.verified_by ? (
              <span className="ml-2 text-muted-foreground">
                by {booking.verified_by}
                {booking.verified_at ? ` · ${new Date(booking.verified_at).toLocaleString()}` : ""}
              </span>
            ) : null}
          </p>

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            disabled={!privileged}
            placeholder="Verification remarks (required to verify or reject)"
            className="mt-2 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-60"
          />

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              disabled={!privileged || remarks.trim().length < 3 || verifyMutation.isPending}
              onClick={() => verifyMutation.mutate("verified")}
              className="rounded-xl bg-navy px-3 py-2 text-xs font-bold text-navy-foreground disabled:opacity-50"
            >
              Mark Verified
            </button>
            <button
              disabled={!privileged || remarks.trim().length < 3 || verifyMutation.isPending}
              onClick={() => verifyMutation.mutate("rejected")}
              className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy disabled:opacity-50"
            >
              Reject
            </button>
            <button
              disabled={!privileged || !isVerified || captured || captureMutation.isPending}
              onClick={() => captureMutation.mutate()}
              className="rounded-xl bg-gold px-3 py-2 text-xs font-bold text-gold-foreground disabled:opacity-50"
            >
              {captured ? "Funds captured" : "Capture Authorized Funds"}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {captured
              ? `Captured by ${booking.captured_by ?? "staff"} on ${new Date(booking.captured_at as string).toLocaleString()}.`
              : privileged
                ? "Capture unlocks only after this booking is marked verified with remarks."
                : "Your role can view this booking but cannot verify or capture funds."}
          </p>
          {notice ? <p className="mt-2 text-xs font-semibold text-destructive">{notice}</p> : null}
        </section>
      </div>

      {revealOpen ? (
        <CardRevealModal bookingId={booking.id} onClose={() => setRevealOpen(false)} />
      ) : null}
    </div>
  );
}


function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchBookings = useServerFn(getAdminBookings);
  const logout = useServerFn(adminLogout);
  const sessionStatus = useServerFn(adminSessionStatus);
  const setStatus = useServerFn(updateBookingStatus);
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState("");
  const openDetails = (id: string | null) => {
    setStatusError("");
    setOpenId(id);
  };

  const session = useQuery({
    queryKey: ["admin-session"],
    queryFn: () => sessionStatus(),
    retry: false,
    staleTime: 60_000,
  });

  const { data, isError } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => fetchBookings(),
    retry: false,
    enabled: session.data?.admin === true,
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: string }) =>
      setStatus({ data: { id: vars.id, status: vars.status as "pending" } }),
    onMutate: () => setStatusError(""),
    onSuccess: (res) => {
      if (!res.ok) setStatusError(res.message);
      void queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
    onError: () => setStatusError("Couldn't change the status. Try again."),
  });

  const signedOut =
    session.isError || session.data?.admin === false || isError || data?.authorized === false;

  if (session.isPending) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-secondary/60 px-4">
        <Loader2 className="size-6 animate-spin text-gold" />
      </div>
    );
  }

  if (signedOut) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-secondary/60 px-4 text-center">
        <div>
          <h1 className="font-display text-xl font-semibold text-navy">Session expired</h1>
          <p className="mt-1 text-sm text-muted-foreground">Please sign in again to view the console.</p>
          <Link
            to="/admin"
            className="mt-4 inline-flex rounded-xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground"
          >
            Go to admin sign-in
          </Link>
        </div>
      </div>
    );
  }

  const all = data?.rows ?? [];
  const role = session.data?.admin ? session.data.role : "agent";

  // Cancelled and refunded bookings aren't sales and need no more checks.
  const active = all.filter((b) => b.status === "pending" || b.status === "issued");
  const gbv = active.reduce((sum, b) => sum + Number(b.total_price), 0);
  const awaiting = active.filter((b) => (b.verification_status ?? "pending") === "pending").length;
  const verified = active.filter((b) => b.verification_status === "verified").length;
  const ticketed = all.filter((b) => b.status === "issued").length;
  const openBooking = all.find((b) => b.id === openId) ?? null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] bg-secondary/60 lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar
        role={role}
        onSignOut={async () => {
          await logout();
          // Nothing from this session (role, bookings, leads) may outlive it in memory.
          queryClient.clear();
          navigate({ to: "/admin", replace: true });
        }}
      />

      <main id="overview" className="min-w-0 px-4 py-6 pb-24 lg:px-6">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold">Overview</p>
            <h1 className="font-display text-2xl font-semibold text-navy">
              Performance &amp; reconciliation
            </h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {session.data?.email || "admin"} · {role}
            </p>
          </div>
          <Link to="/" className="text-xs font-semibold text-navy underline">
            Back to site
          </Link>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            label="Gross Booking Value"
            value={`$${Math.round(gbv).toLocaleString()}`}
            sub={`${active.length} active of ${all.length} bookings`}
            icon={DollarSign}
          />
          <Kpi
            label="Awaiting Verification"
            value={String(awaiting)}
            sub="Capture blocked until verified"
            icon={ShieldCheck}
          />
          <Kpi
            label="Verified"
            value={String(verified)}
            sub="Cleared for fund capture"
            icon={Users}
          />
          <Kpi
            label="Ticketed"
            value={String(ticketed)}
            sub="PNRs issued"
            icon={Ticket}
          />
        </div>


        <BookingsSection rows={all} onOpen={openDetails} />
        <PnrQueue rows={all} onOpen={openDetails} />
        <RefundsSection onOpen={openDetails} />
        <DealsSection role={role} />
        <LeadsSection />
        <VerificationSection />
        {canManageProviders(role) ? <ProvidersSection /> : null}
        {canViewActivity(role) ? <ActivitySection /> : null}
        {role === "superadmin" ? <StaffSection /> : null}
      </main>

      {openBooking ? (
        <DetailsPanel
          booking={openBooking}
          role={role}
          saving={statusMutation.isPending}
          statusError={statusError}
          onOpsChange={() => setStatusError("")}
          onClose={() => openDetails(null)}
          onStatusChange={(status) => statusMutation.mutate({ id: openBooking.id, status })}
        />
      ) : null}

    </div>
  );
}
