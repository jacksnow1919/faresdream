import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Card, SectionTitle, Stat } from "@/components/site/ui";
import { Bell, Bookmark, Crown, LogOut, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Trips & Loyalty Dashboard | FaresDream" },
      {
        name: "description",
        content:
          "Manage active, past and cancelled trips, wallet credits, elite loyalty status, saved searches and price-drop alerts.",
      },
      { property: "og:title", content: "Your Business Class Dashboard" },
      { property: "og:description", content: "Trips, wallet and loyalty tier in one place." },
    ],
  }),
  component: Dashboard,
});

const tiers = ["silver", "gold", "platinum"] as const;

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"active" | "past" | "cancelled">("active");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
      return data;
    },
  });

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const all = bookings ?? [];
  const filtered = all.filter((b) =>
    tab === "active"
      ? b.status === "pending" || b.status === "issued"
      : tab === "past"
        ? b.status === "refunded"
        : b.status === "cancelled",
  );

  const tier = (profile?.loyalty_tier ?? "silver") as (typeof tiers)[number];

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <PageShell
      eyebrow="Customer Dashboard"
      title={profile?.full_name ? `Welcome, ${profile.full_name}` : "My account"}
      subtitle="Trips, wallet credits and loyalty status."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Wallet & credits" value={`$${Number(profile?.wallet_credits ?? 0).toLocaleString()}`} />
        <Stat label="Total bookings" value={String(all.length)} />
        <Stat label="Loyalty tier" value={tier.toUpperCase()} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle>My Trips</SectionTitle>
              <div className="inline-flex rounded-full bg-secondary p-1 text-xs font-semibold">
                {(["active", "past", "cancelled"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3 py-1.5 capitalize ${
                      tab === t ? "bg-navy text-navy-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No {tab} trips yet.{" "}
                <Link to="/flight/search" search={{ origin: "JFK", destination: "MIA", date: "", passengers: 1, cabin: "Business" }} className="font-semibold text-navy underline">
                  Find a business class fare
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-border">
                {filtered.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-navy">
                        {b.origin} → {b.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.airline} · {b.depart_date} · PNR {b.pnr ?? "pending"}
                      </p>
                    </div>
                    <span className="shrink-0 font-display text-lg font-semibold text-navy">
                      ${Number(b.total_price).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <SectionTitle>Elite loyalty status</SectionTitle>
            <div className="mt-4 flex gap-2">
              {tiers.map((t) => (
                <div
                  key={t}
                  className={`flex-1 rounded-xl border p-3 text-center text-xs font-bold uppercase ${
                    t === tier ? "border-gold bg-gold/10 text-navy" : "border-border text-muted-foreground"
                  }`}
                >
                  <Crown className={`mx-auto size-4 ${t === tier ? "text-gold" : ""}`} />
                  {t}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {tier === "platinum"
                ? "Platinum: unlimited lounge access with a guest, guaranteed upgrades and a dedicated concierge."
                : tier === "gold"
                  ? "Gold: lounge access at 60+ airports and priority waitlists. 4 more trips to Platinum."
                  : "Silver: 1 lounge pass per trip. 2 more trips to Gold."}
            </p>
          </Card>

          <Card>
            <SectionTitle>Saved searches & price alerts</SectionTitle>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { route: "JFK → LHR", note: "Alert set below $1,900" },
                { route: "LAX → DXB", note: "Price dropped 6% this week" },
              ].map((s) => (
                <li key={s.route} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-semibold text-navy">
                    <Bookmark className="size-4 text-gold" /> {s.route}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Bell className="size-3" /> {s.note}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Wallet className="size-3.5" /> Wallet
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-navy">
              ${Number(profile?.wallet_credits ?? 0).toLocaleString()}
            </p>
            <button
              onClick={signOut}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-navy"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </Card>

        </div>
      </div>
    </PageShell>
  );
}
