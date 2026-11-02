import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, UserPlus, Users } from "lucide-react";
import { createStaff, listStaff, updateStaff, type StaffRole } from "@/lib/staff.functions";

const ROLES: { value: StaffRole; label: string; blurb: string }[] = [
  { value: "agent", label: "Agent", blurb: "View bookings, masked cards, no capture" },
  { value: "manager", label: "Manager", blurb: "Verify, capture funds, audited card reveal" },
  { value: "superadmin", label: "Superadmin", blurb: "Everything plus staff management" },
];

export function StaffSection() {
  const queryClient = useQueryClient();
  const fetchStaff = useServerFn(listStaff);
  const addStaff = useServerFn(createStaff);
  const patchStaff = useServerFn(updateStaff);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("agent");
  const [message, setMessage] = useState("");

  const { data, isPending } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: () => fetchStaff(),
    retry: false,
  });

  const create = useMutation({
    mutationFn: () =>
      addStaff({ data: { email: email.trim(), fullName: fullName.trim(), password, role } }),
    onSuccess: (res) => {
      if (!res.ok) {
        setMessage(res.message);
        return;
      }
      setMessage("Account created.");
      setEmail("");
      setFullName("");
      setPassword("");
      void queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });

  const patch = useMutation({
    mutationFn: (vars: { id: string; role?: StaffRole; active?: boolean }) =>
      patchStaff({ data: vars }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-activity"] });
    },
  });

  if (data && data.authorized === false) return null;

  return (
    <section id="staff" className="mt-6 rounded-2xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-navy">
          <Users className="size-4 text-gold" /> Staff &amp; roles
        </h2>
        <span className="text-xs text-muted-foreground">{data?.rows.length ?? 0} accounts</span>
      </div>

      <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="staff@faresdream.com"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Temporary password"
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as StaffRole)}
          className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => create.mutate()}
          disabled={!email.trim() || password.length < 8 || create.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-bold text-navy-foreground disabled:opacity-50"
        >
          {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          Add staff
        </button>
        <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-5">
          {message || ROLES.map((r) => `${r.label}: ${r.blurb}`).join(" · ")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-secondary text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Email</th>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Role</th>
              <th className="px-4 py-2.5 font-semibold">Last login</th>
              <th className="px-4 py-2.5 font-semibold">Access</th>
            </tr>
          </thead>
          <tbody>
            {isPending ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : (data?.rows.length ?? 0) === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No staff accounts yet — add one above.
                </td>
              </tr>
            ) : (
              data?.rows.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3 font-semibold text-navy">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.full_name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={s.role}
                      onChange={(e) => patch.mutate({ id: s.id, role: e.target.value as StaffRole })}
                      className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs font-semibold"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {s.last_login_at ? new Date(s.last_login_at).toLocaleString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => patch.mutate({ id: s.id, active: !s.active })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                        s.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "border border-border text-muted-foreground"
                      }`}
                    >
                      {s.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
