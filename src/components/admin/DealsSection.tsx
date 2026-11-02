import { useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus } from "lucide-react";
import { deleteDeal, endDeal, listDeals, saveDeal, type DealRow } from "@/lib/admin-ops.functions";
import {
  DEAL_CURRENCIES,
  canManageDeals,
  dealEndError,
  dealSchema,
  dealState,
  firstIssue,
  formatMoney,
  newYorkYmd,
  type StaffRole,
} from "@/lib/admin-logic";
import { cityOf } from "@/lib/airports";
import { DatePicker } from "@/components/site/DatePicker";

const CABINS = ["Economy", "Premium Economy", "Business", "First"] as const;

type DealForm = {
  id?: string;
  origin: string;
  destination: string;
  airline: string;
  cabinClass: string;
  price: string;
  currency: string;
  endsOn: string;
};

const blank: DealForm = {
  origin: "",
  destination: "",
  airline: "",
  cabinClass: "Economy",
  price: "",
  currency: "USD",
  endsOn: "",
};

const inputCls =
  "mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-navy outline-none focus:border-gold";

const STATE_BADGE = {
  live: { label: "Live", cls: "bg-emerald-100 text-emerald-700" },
  ending: { label: "Ending soon", cls: "bg-gold/15 text-navy ring-1 ring-gold/40" },
  expired: { label: "Ended", cls: "bg-secondary text-muted-foreground" },
} as const;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
      {label}
      {children}
    </label>
  );
}

const toForm = (d: DealRow): DealForm => ({
  id: d.id,
  origin: d.origin,
  destination: d.destination,
  airline: d.airline,
  cabinClass: d.cabin_class,
  price: String(Number(d.price)),
  currency: d.currency,
  endsOn: d.expires_at ? newYorkYmd(d.expires_at) : "",
});

/** The deals shown on /deals: add, edit, end and delete. Managers and superadmins only. */
export function DealsSection({ role }: { role: StaffRole }) {
  const fetchDeals = useServerFn(listDeals);
  const save = useServerFn(saveDeal);
  const end = useServerFn(endDeal);
  const remove = useServerFn(deleteDeal);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DealForm | null>(null);
  const [problem, setProblem] = useState("");
  const editable = canManageDeals(role);

  const deals = useQuery({ queryKey: ["admin-deals"], queryFn: () => fetchDeals() });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin-deals"] });
    void queryClient.invalidateQueries({ queryKey: ["deals"] });
    void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
  };

  const saveMutation = useMutation({
    mutationFn: async (f: DealForm) => {
      const input = {
        ...(f.id ? { id: f.id } : {}),
        origin: f.origin,
        destination: f.destination,
        airline: f.airline,
        cabinClass: f.cabinClass,
        price: f.price.trim() === "" ? Number.NaN : Number(f.price),
        currency: f.currency,
        endsOn: f.endsOn || null,
      };
      const parsed = dealSchema.safeParse(input);
      if (!parsed.success) return { ok: false as const, message: firstIssue(parsed.error) };
      const endError = dealEndError(parsed.data.endsOn);
      if (endError) return { ok: false as const, message: endError };
      return save({ data: parsed.data });
    },
    onSuccess: (res) => {
      if (!res.ok) return setProblem(res.message);
      setForm(null);
      setProblem("");
      refresh();
    },
    onError: () => setProblem("Couldn't save the deal. Try again."),
  });

  const actionMutation = useMutation({
    mutationFn: (v: { kind: "end" | "delete"; id: string }) =>
      v.kind === "end" ? end({ data: { id: v.id } }) : remove({ data: { id: v.id } }),
    onSuccess: (res) => (res.ok ? refresh() : setProblem(res.message)),
    onError: () => setProblem("Couldn't update the deal. Try again."),
  });

  const set = (k: keyof DealForm) => (e: { target: { value: string } }) => {
    setProblem("");
    setForm((f) => (f ? { ...f, [k]: e.target.value } : f));
  };

  const rows = deals.data?.ok ? deals.data.rows : [];
  const live = rows.filter((d) => dealState(d.expires_at) !== "expired").length;

  return (
    <section id="deals" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display text-base font-semibold text-navy">Deals</h2>
          <p className="text-xs text-muted-foreground">
            {live} live on the Deals page
            {rows.length > live ? ` · ${rows.length - live} ended` : ""}
            {rows.length === 0 && deals.data?.ok
              ? " · the site shows its built-in backup deals until you add one"
              : ""}
          </p>
        </div>
        {editable && !form ? (
          <button
            onClick={() => {
              setProblem("");
              setForm(blank);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-xs font-bold text-navy-foreground"
          >
            <Plus className="size-3.5" /> Add deal
          </button>
        ) : null}
      </div>

      {form ? (
        <form
          className="grid gap-3 border-b border-border bg-secondary/40 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <Field
            label={`From${form.origin.length === 3 ? ` · ${cityOf(form.origin.toUpperCase())}` : ""}`}
          >
            <input
              value={form.origin}
              onChange={set("origin")}
              maxLength={3}
              placeholder="JFK"
              className={`${inputCls} uppercase`}
            />
          </Field>
          <Field
            label={`To${form.destination.length === 3 ? ` · ${cityOf(form.destination.toUpperCase())}` : ""}`}
          >
            <input
              value={form.destination}
              onChange={set("destination")}
              maxLength={3}
              placeholder="LHR"
              className={`${inputCls} uppercase`}
            />
          </Field>
          <Field label="Airline">
            <input
              value={form.airline}
              onChange={set("airline")}
              placeholder="British Airways"
              className={inputCls}
            />
          </Field>
          <Field label="Cabin">
            <select
              value={form.cabinClass}
              onChange={set("cabinClass")}
              className={`${inputCls} cursor-pointer`}
            >
              {CABINS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="One-way price per person">
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={set("price")}
              className={inputCls}
            />
          </Field>
          <Field label="Currency">
            <select
              value={form.currency}
              onChange={set("currency")}
              className={`${inputCls} cursor-pointer`}
            >
              {DEAL_CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          {/* A div, not Field's label: clicks inside a label would re-open the calendar. */}
          <div className="block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Last day (New York), optional
            <DatePicker
              ariaLabel="Last day of the deal"
              value={form.endsOn}
              min={newYorkYmd()}
              onChange={(v) => {
                setProblem("");
                setForm((f) => (f ? { ...f, endsOn: v } : f));
              }}
              className={`${inputCls} normal-case tracking-normal`}
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-navy px-4 text-xs font-bold text-navy-foreground disabled:opacity-50"
            >
              {saveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {form.id ? "Save changes" : "Add deal"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setProblem("");
              }}
              className="h-9 rounded-xl border border-border px-4 text-xs font-bold text-navy"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {problem ? (
        <p role="alert" className="px-4 pt-3 text-xs font-semibold text-destructive">
          {problem}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Route</th>
              <th className="px-4 py-2.5 font-semibold">Airline</th>
              <th className="px-4 py-2.5 font-semibold">Cabin</th>
              <th className="px-4 py-2.5 font-semibold">Price</th>
              <th className="px-4 py-2.5 font-semibold">Ends</th>
              <th className="px-4 py-2.5 font-semibold">State</th>
              <th className="px-4 py-2.5 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.isPending ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Loading deals…
                </td>
              </tr>
            ) : deals.data && !deals.data.ok ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-xs text-destructive">
                  {deals.data.message}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No deals yet.
                </td>
              </tr>
            ) : (
              rows.map((d) => {
                const state = dealState(d.expires_at);
                return (
                  <tr key={d.id} className="border-t border-border">
                    <td className="px-4 py-3 font-semibold text-navy">
                      {d.origin} → {d.destination}
                    </td>
                    <td className="px-4 py-3">{d.airline}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{d.cabin_class}</td>
                    <td className="px-4 py-3 font-semibold text-navy">
                      {formatMoney(Number(d.price), d.currency)}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {d.expires_at ? newYorkYmd(d.expires_at) : "No end date"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${STATE_BADGE[state].cls}`}
                      >
                        {STATE_BADGE[state].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editable ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setProblem("");
                              setForm(toForm(d));
                            }}
                            className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-navy hover:border-gold"
                          >
                            Edit
                          </button>
                          {state !== "expired" ? (
                            <button
                              disabled={actionMutation.isPending}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `End the ${d.origin}-${d.destination} deal now? It disappears from the Deals page.`,
                                  )
                                ) {
                                  actionMutation.mutate({ kind: "end", id: d.id });
                                }
                              }}
                              className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-navy hover:border-gold disabled:opacity-50"
                            >
                              End now
                            </button>
                          ) : null}
                          <button
                            disabled={actionMutation.isPending}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete the ${d.origin}-${d.destination} deal for good?`,
                                )
                              ) {
                                actionMutation.mutate({ kind: "delete", id: d.id });
                              }
                            }}
                            className="rounded-lg border border-destructive/30 px-2.5 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/5 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!editable ? (
        <p className="px-4 py-3 text-xs text-muted-foreground">Only managers can change deals.</p>
      ) : null}
    </section>
  );
}
