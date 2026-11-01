import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, Card, SectionTitle, Stat, Field } from "@/components/site/ui";
import { DatePicker } from "@/components/site/DatePicker";
import { format } from "date-fns";
import { Percent, Search, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agent")({
  head: () => ({
    meta: [
      { title: "Agent B2B Portal — Net Fares & Payouts | FaresDream" },
      {
        name: "description",
        content:
          "Wholesale travel agent portal: search net business class fares, add commission markups, book for clients and track monthly payouts.",
      },
      { property: "og:title", content: "Agent B2B Portal" },
      {
        property: "og:description",
        content: "Net fares, markup control and payout tracking for travel agents.",
      },
    ],
  }),
  component: AgentPortal,
});

const netFares = [
  { route: "JFK → LHR", airline: "British Airways", net: 1610, cabin: "Business" },
  { route: "JFK → DEL", airline: "Emirates", net: 1840, cabin: "Business" },
  { route: "LAX → DXB", airline: "Emirates", net: 2480, cabin: "Business" },
  { route: "SFO → SIN", airline: "Singapore Airlines", net: 2720, cabin: "Business" },
];

function AgentPortal() {
  const [markup, setMarkup] = useState("8");
  const [depart, setDepart] = useState("");
  const rate = Number(markup) || 0;

  const { data: agent } = useQuery({
    queryKey: ["agent-profile"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return null;
      const { data } = await supabase
        .from("agent_profiles")
        .select("*")
        .eq("user_id", auth.user.id)
        .maybeSingle();
      return data;
    },
  });

  return (
    <PageShell
      eyebrow="B2B Portal"
      title={agent?.agency_name ?? "Agent workspace"}
      subtitle="Search net fares, apply your markup, book on behalf of clients and track payouts."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Commission rate" value={`${Number(agent?.commission_rate ?? 5)}%`} />
        <Stat
          label="Total earnings"
          value={`$${Number(agent?.total_earnings ?? 0).toLocaleString()}`}
        />
        <Stat label="Payout cycle" value="Monthly · Net 15" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <SectionTitle>Net fare search</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Origin" placeholder="JFK" />
            <Field label="Destination" placeholder="LHR" />
            <div className="relative z-20">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Depart
              </span>
              <DatePicker
                ariaLabel="Depart"
                value={depart}
                onChange={setDepart}
                min={format(new Date(), "yyyy-MM-dd")}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>
          </div>
          <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-bold text-navy-foreground">
            <Search className="size-4" /> Search net fares
          </button>

          <ul className="mt-5 divide-y divide-border">
            {netFares.map((f) => {
              const sell = Math.round(f.net * (1 + rate / 100));
              return (
                <li
                  key={f.route}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{f.route}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.airline} · {f.cabin}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Net
                      </p>
                      <p className="font-semibold">${f.net.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Sell
                      </p>
                      <p className="font-display text-lg font-semibold text-navy">
                        ${sell.toLocaleString()}
                      </p>
                    </div>
                    <button className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-gold-foreground">
                      Book for client
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Percent className="size-3.5" /> Markup
            </p>
            <Field label="Markup %" value={markup} onChange={setMarkup} />
            <p className="mt-2 text-xs text-muted-foreground">
              Applied to every net fare shown in this session.
            </p>
          </Card>
          <Card>
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
              <Wallet className="size-3.5" /> Monthly payouts
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { m: "July 2026", v: 8420 },
                { m: "June 2026", v: 7310 },
                { m: "May 2026", v: 6890 },
              ].map((p) => (
                <li key={p.m} className="flex justify-between">
                  <span className="text-muted-foreground">{p.m}</span>
                  <span className="font-semibold text-navy">${p.v.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
