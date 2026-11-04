import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  CheckCircle2,
  CirclePause,
  CirclePlay,
  KeyRound,
  Loader2,
  RefreshCw,
  XCircle,
  Zap,
} from "lucide-react";
import {
  getProviderPanel,
  setProviderPause,
  testProvider,
  type ProviderPanelRow,
  type ProviderTestResult,
} from "@/lib/provider-admin.functions";
import {
  PAUSE_OPTIONS,
  PROVIDER_KEYS,
  PROVIDERS,
  type ProviderHealth,
  type ProviderKey,
} from "@/lib/flight-providers";

type Days = 1 | 7 | 30;

const HEALTH: Record<ProviderHealth, { label: string; className: string }> = {
  working: { label: "Working", className: "bg-emerald-100 text-emerald-800" },
  idle: { label: "No searches yet", className: "bg-secondary text-muted-foreground" },
  failing: { label: "Failing", className: "bg-red-100 text-red-800" },
  paused: { label: "Paused", className: "bg-amber-100 text-amber-900" },
  no_key: { label: "Key missing", className: "bg-secondary text-muted-foreground" },
};

const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;
const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : "Never");

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-1.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-navy">{value}</span>
    </div>
  );
}

function ProviderCard({
  p,
  onlyActive,
  ready,
  days,
}: {
  p: ProviderPanelRow;
  /** This is the last API still serving fares. */
  onlyActive: boolean;
  ready: boolean;
  days: Days;
}) {
  const queryClient = useQueryClient();
  const pauseFn = useServerFn(setProviderPause);
  const testFn = useServerFn(testProvider);
  const [form, setForm] = useState(false);
  const [minutes, setMinutes] = useState<60 | 360 | 1440 | null>(null);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const [test, setTest] = useState<ProviderTestResult | null>(null);

  const pause = useMutation({
    mutationFn: (paused: boolean) =>
      pauseFn({
        data: {
          provider: p.key,
          paused,
          ...(paused ? { minutes, reason } : {}),
        },
      }),
    onMutate: () => setNotice(""),
    onSuccess: (res) => {
      if (!res.ok) {
        setNotice(res.message);
        return;
      }
      setForm(false);
      setReason("");
      setMinutes(null);
      void queryClient.invalidateQueries({ queryKey: ["admin-providers", days] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
    onError: () => setNotice("Couldn't save that. Try again."),
  });

  const runTest = useMutation({
    mutationFn: () => testFn({ data: { provider: p.key } }),
    onMutate: () => {
      setNotice("");
      setTest(null);
    },
    onSuccess: (res) => {
      if (res.ok) setTest(res.result);
      else setNotice(res.message);
    },
    onError: () => setNotice("Couldn't run the test. Try again."),
  });

  const health = HEALTH[p.health];
  const configured = p.keys.every((k) => k.set);

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-navy">{p.label}</h3>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${health.className}`}>
          {health.label}
        </span>
      </div>

      {p.testMode ? (
        <p className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-medium text-amber-900">
          This is a test key, so it returns sample airline data, not real fares.
        </p>
      ) : null}

      {p.paused ? (
        <div className="mt-2 rounded-lg bg-amber-100 px-3 py-2 text-xs text-amber-900">
          <p className="font-semibold">
            {p.pausedUntil
              ? `Resumes by itself ${when(p.pausedUntil)}`
              : "Paused until someone resumes it"}
          </p>
          <p>
            By {p.pausedBy || "admin"}, {when(p.pausedAt)}
          </p>
          {p.reason ? <p>Reason: {p.reason}</p> : null}
        </div>
      ) : null}

      <div className="mt-3">
        <Stat label="Searches with fares" value={`${p.withFares} of ${p.lookups}`} />
        <Stat label="Fares returned" value={p.faresReturned.toLocaleString()} />
        <Stat label="Errors" value={String(p.failed)} />
        <Stat label="Average answer time" value={p.lookups ? seconds(p.avgMs) : "—"} />
        <Stat label="Last fares" value={when(p.lastFaresAt)} />
      </div>

      {p.lastError && p.health === "failing" ? (
        <p className="mt-2 break-words rounded-lg bg-red-100 px-3 py-2 text-xs text-red-800">
          Last error, {when(p.lastErrorAt)}: {p.lastError}
        </p>
      ) : null}

      <ul className="mt-3 space-y-1">
        {p.keys.map((k) => (
          <li key={k.name} className="flex items-center gap-1.5 text-xs text-navy">
            {k.set ? (
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-700" />
            ) : (
              <XCircle className="size-3.5 shrink-0 text-red-700" />
            )}
            <code className="break-all">{k.name}</code>
            <span className="text-muted-foreground">{k.set ? "set" : "missing"}</span>
          </li>
        ))}
      </ul>

      {form ? (
        <div className="mt-3 space-y-2 rounded-xl border border-border p-3">
          <label className="block text-xs font-semibold text-navy">
            Pause for
            <select
              value={minutes ?? ""}
              onChange={(e) =>
                setMinutes(e.target.value ? (Number(e.target.value) as 60 | 360 | 1440) : null)
              }
              className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-2 text-sm font-normal text-navy outline-none focus:border-gold"
            >
              {PAUSE_OPTIONS.map((o) => (
                <option key={o.label} value={o.minutes ?? ""}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-navy">
            Reason (optional)
            <input
              value={reason}
              maxLength={200}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Over the search limit"
              className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal text-navy outline-none focus:border-gold"
            />
          </label>
          {onlyActive ? (
            <p className="flex gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-800">
              <AlertTriangle className="size-3.5 shrink-0" />
              This is your only active API. Customers won't see any fares while it's paused.
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => pause.mutate(true)}
              disabled={pause.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-navy px-3 py-2 text-xs font-bold text-navy-foreground disabled:opacity-50"
            >
              <CirclePause className="size-3.5" />
              {onlyActive ? "Pause anyway" : `Pause ${p.label}`}
            </button>
            <button
              onClick={() => setForm(false)}
              className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {p.paused ? (
            <button
              onClick={() => pause.mutate(false)}
              disabled={pause.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-3 py-2 text-xs font-bold text-gold-foreground disabled:opacity-50"
            >
              <CirclePlay className="size-3.5" /> Resume
            </button>
          ) : (
            <button
              onClick={() => setForm(true)}
              disabled={!ready}
              title={ready ? undefined : "Needs the one-time database update"}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
            >
              <CirclePause className="size-3.5" /> Pause
            </button>
          )}
          <button
            onClick={() => runTest.mutate()}
            disabled={runTest.isPending || !configured}
            title={configured ? "Runs one real search, JFK to LAX" : "Add the missing key first"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
          >
            {runTest.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Zap className="size-3.5" />
            )}
            Test key
          </button>
        </div>
      )}

      {notice ? <p className="mt-2 text-xs font-medium text-destructive">{notice}</p> : null}
      {test ? (
        <p
          className={`mt-2 break-words rounded-lg px-3 py-2 text-xs ${
            test.working ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          {test.working
            ? `Working: ${test.fares} fares in ${seconds(test.ms)}. ${test.message}`
            : `Not working: ${test.message}`}
        </p>
      ) : null}
    </article>
  );
}

function AnswerCell({
  answer,
}: {
  answer: { status: string; fares: number; ms: number; message: string | null } | undefined;
}) {
  if (!answer) return <span className="text-muted-foreground">—</span>;
  if (answer.status === "paused")
    return <span className="font-semibold text-amber-900">Paused</span>;
  if (answer.status === "error") {
    return (
      <span className="font-semibold text-red-800" title={answer.message ?? undefined}>
        Error · {seconds(answer.ms)}
      </span>
    );
  }
  return (
    <span className="text-navy" title={answer.message ?? undefined}>
      {answer.fares} fares · {seconds(answer.ms)}
    </span>
  );
}

/** Each flight API's health, with pause, resume and a key test. Managers and up. */
export function ProvidersSection() {
  const fetchPanel = useServerFn(getProviderPanel);
  const [days, setDays] = useState<Days>(1);
  const panel = useQuery({
    queryKey: ["admin-providers", days],
    queryFn: () => fetchPanel({ data: { days } }),
  });
  const data = panel.data;
  const providers = data?.ok ? data.providers : [];
  const active = providers.filter((p) => p.health !== "no_key" && !p.paused);

  return (
    <section id="providers" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="font-display text-base font-semibold text-navy">Flight APIs</h2>
          <p className="text-xs text-muted-foreground">
            Every search asks each active API at once. When two sell the same trip, customers see it
            once, at the cheaper price.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value) as Days)}
            aria-label="Period"
            className="h-9 rounded-xl border border-input bg-background px-2 text-xs font-semibold text-navy outline-none focus:border-gold"
          >
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button
            onClick={() => void panel.refetch()}
            disabled={panel.isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-navy transition hover:border-gold disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 ${panel.isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {panel.isPending ? (
        <p className="px-4 py-6 text-center text-xs text-muted-foreground">Loading flight APIs…</p>
      ) : panel.isError ? (
        <p className="px-4 py-6 text-center text-xs text-destructive">
          Couldn't load the flight APIs. Try Refresh.
        </p>
      ) : data && !data.ok ? (
        <p className="px-4 py-6 text-center text-xs text-destructive">{data.message}</p>
      ) : data?.ok ? (
        <div className="p-4">
          {!data.ready ? (
            <p className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-xs font-medium text-amber-900">
              Pausing and the search figures need a one-time database update. Searching still works
              without it.
            </p>
          ) : null}
          {active.length === 0 ? (
            <p className="mb-3 flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-800">
              <AlertTriangle className="size-3.5 shrink-0" />
              No API is active, so customers can't see any fares right now.
            </p>
          ) : null}
          {providers.some((p) => p.keys.some((k) => !k.set)) ? (
            <p className="mb-3 flex gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs text-navy">
              <KeyRound className="size-3.5 shrink-0" />
              Add a missing key on the live site in Cloudflare: Workers &amp; Pages, faresdream,
              Settings, Variables and secrets. Use the exact name shown and choose the Secret type.
            </p>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-3">
            {providers.map((p) => (
              <ProviderCard
                key={p.key}
                p={p}
                ready={data.ready}
                days={days}
                onlyActive={active.length === 1 && active[0]?.key === p.key}
              />
            ))}
          </div>

          <h3 className="mt-5 font-display text-sm font-semibold text-navy">Latest searches</h3>
          {data.recent.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No searches in this period.
            </p>
          ) : (
            <div className="mt-2 max-h-[420px] overflow-auto rounded-xl border border-border">
              <table className="w-full min-w-[720px] text-left text-xs">
                <thead className="sticky top-0 bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-semibold">When</th>
                    <th className="px-3 py-2 font-semibold">Route</th>
                    <th className="px-3 py-2 font-semibold">Travel date</th>
                    {PROVIDER_KEYS.map((k: ProviderKey) => (
                      <th key={k} className="px-3 py-2 font-semibold">
                        {PROVIDERS[k].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recent.map((s) => (
                    <tr key={s.id}>
                      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                        {new Date(s.at).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-semibold text-navy">
                        {s.origin} → {s.destination}
                        {s.returnDate ? " (return)" : ""}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-navy">{s.departDate}</td>
                      {PROVIDER_KEYS.map((k: ProviderKey) => (
                        <td key={k} className="whitespace-nowrap px-3 py-2">
                          <AnswerCell answer={s.answers[k]} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
