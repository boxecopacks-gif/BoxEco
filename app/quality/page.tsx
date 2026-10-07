"use client";

import { useEffect, useState, FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import Trends from "./Trends";
import { WATCH_RATE, HIGH_RATE } from "./config";

type Inspection = {
  id: number;
  created_at: string;
  inspector_email: string | null;
  batch_no: string;
  box_type: string;
  sample_size: number;
  size_defects: number;
  fold_defects: number;
  print_defects: number;
  lock_defects: number;
  notes: string | null;
};

const BOX_TYPES = ["Gable Handle Box", "Takeaway Meal Box", "Hexagon Box"];

const CHECKS = [
  { key: "size_defects", label: "Size" },
  { key: "fold_defects", label: "Fold" },
  { key: "print_defects", label: "Print" },
  { key: "lock_defects", label: "Lock" },
] as const;

function totalDefects(r: Inspection) {
  return r.size_defects + r.fold_defects + r.print_defects + r.lock_defects;
}

function riskLevel(rate: number) {
  if (rate >= HIGH_RATE) return { label: "High risk", color: "bg-red-100 text-red-800" };
  if (rate >= WATCH_RATE) return { label: "Watch", color: "bg-amber-100 text-amber-800" };
  return { label: "Good", color: "bg-green-100 text-green-800" };
}

export default function Quality() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) {
    return <main className="mx-auto max-w-4xl px-6 py-12">Loading...</main>;
  }
  return session ? <Dashboard session={session} /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Staff login</h1>
      <p className="mt-2 text-gray-600">Quality records are for BoxEco staff only.</p>
      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border p-3"
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-green-800 p-3 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [records, setRecords] = useState<Inspection[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    batch_no: "",
    box_type: BOX_TYPES[0],
    sample_size: "",
    size_defects: "0",
    fold_defects: "0",
    print_defects: "0",
    lock_defects: "0",
    notes: "",
  });

  async function load() {
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) setMessage(error.message);
    else setRecords(data as Inspection[]);
  }

  useEffect(() => {
    load();
  }, []);

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    const sample = Number(form.sample_size);
    const counts = CHECKS.map((c) => Number(form[c.key]));

    if (!sample || sample < 1) return setMessage("Enter how many boxes were checked.");
    if (counts.some((n) => n < 0 || n > sample)) {
      return setMessage("A defect count cannot be negative or bigger than the sample size.");
    }

    setSaving(true);
    const { error } = await supabase.from("inspections").insert({
      batch_no: form.batch_no.trim(),
      box_type: form.box_type,
      sample_size: sample,
      size_defects: Number(form.size_defects),
      fold_defects: Number(form.fold_defects),
      print_defects: Number(form.print_defects),
      lock_defects: Number(form.lock_defects),
      notes: form.notes.trim() || null,
      inspector_email: session.user.email,
    });
    setSaving(false);

    if (error) return setMessage(error.message);
    setMessage("Saved.");
    setForm((f) => ({
      ...f,
      batch_no: "",
      sample_size: "",
      size_defects: "0",
      fold_defects: "0",
      print_defects: "0",
      lock_defects: "0",
      notes: "",
    }));
    load();
  }

  const summary = BOX_TYPES.map((type) => {
    const rows = records.filter((r) => r.box_type === type);
    const checked = rows.reduce((s, r) => s + r.sample_size, 0);
    const byCheck = CHECKS.map((c) => rows.reduce((s, r) => s + r[c.key], 0));
    const defects = byCheck.reduce((a, b) => a + b, 0);
    const rate = checked ? (defects / checked) * 100 : 0;
    return { type, batches: rows.length, checked, byCheck, rate };
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-900">Quality dashboard</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Sign out ({session.user.email})
        </button>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Defect rate by box type</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {summary.map((s) => {
          const risk = riskLevel(s.rate);
          return (
            <div key={s.type} className="rounded-xl border p-5">
              <h3 className="font-semibold">{s.type}</h3>
              <p className="mt-2 text-3xl font-bold">{s.rate.toFixed(1)}%</p>
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${risk.color}`}>
                {s.batches ? risk.label : "No data"}
              </span>
              <p className="mt-3 text-sm text-gray-600">
                {s.batches} batches, {s.checked} boxes checked
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {CHECKS.map((c, i) => `${c.label}: ${s.byCheck[i]}`).join(" | ")}
              </p>
            </div>
          );
        })}
      </div>

      <Trends records={records} />
      <form onSubmit={handleSubmit} className="mt-4 space-y-4 rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            Batch number
            <input
              required
              value={form.batch_no}
              onChange={(e) => update("batch_no", e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>
          <label className="text-sm">
            Box type
            <select
              value={form.box_type}
              onChange={(e) => update("box_type", e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            >
              {BOX_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Boxes checked
            <input
              required
              type="number"
              min="1"
              value={form.sample_size}
              onChange={(e) => update("sample_size", e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </label>
        </div>

        <p className="text-sm text-gray-600">
          How many of the checked boxes had a problem with each of these?
        </p>
        <div className="grid gap-4 sm:grid-cols-4">
          {CHECKS.map((c) => (
            <label key={c.key} className="text-sm">
              {c.label} defects
              <input
                type="number"
                min="0"
                value={form[c.key]}
                onChange={(e) => update(c.key, e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </label>
          ))}
        </div>

        <label className="block text-sm">
          Notes (optional)
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="mt-1 w-full rounded-lg border p-2"
            rows={2}
          />
        </label>

        {message && <p className="text-sm text-green-900">{message}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-green-800 px-5 py-2 font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save result"}
        </button>
      </form>

      <h2 className="mt-12 text-xl font-semibold">Recent records</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Box</th>
              <th className="p-3">Checked</th>
              <th className="p-3">Defects</th>
              <th className="p-3">Rate</th>
              <th className="p-3">By</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 20).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="p-3">{r.batch_no}</td>
                <td className="p-3">{r.box_type}</td>
                <td className="p-3">{r.sample_size}</td>
                <td className="p-3">{totalDefects(r)}</td>
                <td className="p-3">{((totalDefects(r) / r.sample_size) * 100).toFixed(1)}%</td>
                <td className="p-3">{r.inspector_email}</td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td className="p-3 text-gray-600" colSpan={7}>
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}