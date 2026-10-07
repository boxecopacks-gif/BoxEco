import { WATCH_RATE, HIGH_RATE } from "./config";
type Rec = {
  id: number;
  created_at: string;
  batch_no: string;
  box_type: string;
  sample_size: number;
  size_defects: number;
  fold_defects: number;
  print_defects: number;
  lock_defects: number;
};

const BOX_TYPES = ["Gable Handle Box", "Takeaway Meal Box", "Hexagon Box"];

// Change these to your real acceptable defect rates (in percent)


const MIN_BATCHES = 4; // batches needed before forecasting
const LAST_N = 12; // batches shown on each chart

const CHECKS = [
  { key: "size_defects", label: "Size" },
  { key: "fold_defects", label: "Fold" },
  { key: "print_defects", label: "Print" },
  { key: "lock_defects", label: "Lock" },
] as const;

function rateOf(r: Rec) {
  const d = r.size_defects + r.fold_defects + r.print_defects + r.lock_defects;
  return (d / r.sample_size) * 100;
}

function trend(values: number[]) {
  const n = values.length;
  const mx = (n - 1) / 2;
  const my = values.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  values.forEach((y, x) => {
    num += (x - mx) * (y - my);
    den += (x - mx) ** 2;
  });
  const slope = den ? num / den : 0;
  const next = Math.max(0, my + slope * (n - mx));
  return { slope, next };
}

function Spark({ values }: { values: number[] }) {
  const w = 240;
  const h = 70;
  const pad = 6;
  const max = Math.max(HIGH_RATE * 1.5, ...values);
  const x = (i: number) =>
    values.length === 1 ? w / 2 : pad + (i * (w - 2 * pad)) / (values.length - 1);
  const y = (v: number) => h - pad - (v / max) * (h - 2 * pad);
  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-20 w-full text-green-800">
      <line x1="0" x2={w} y1={y(WATCH_RATE)} y2={y(WATCH_RATE)} stroke="#d97706" strokeDasharray="3 3" strokeWidth="1" />
      <line x1="0" x2={w} y1={y(HIGH_RATE)} y2={y(HIGH_RATE)} stroke="#dc2626" strokeDasharray="3 3" strokeWidth="1" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="currentColor" />
      ))}
    </svg>
  );
}

export default function Trends({ records }: { records: Rec[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold">Trends and early warnings</h2>
      <p className="mt-1 text-sm text-gray-600">
        Defect rate per batch, oldest to newest (last {LAST_N} batches). Amber line: watch ({WATCH_RATE}%). Red line: high risk ({HIGH_RATE}%).
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {BOX_TYPES.map((type) => {
          const rows = records
            .filter((r) => r.box_type === type)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .slice(-LAST_N);
          const values = rows.map(rateOf);

          let status = { text: "No data yet", color: "bg-gray-100 text-gray-700" };
          let forecastText = "";
          if (values.length > 0 && values.length < MIN_BATCHES) {
            status = { text: `Need ${MIN_BATCHES - values.length} more batches to forecast`, color: "bg-gray-100 text-gray-700" };
          } else if (values.length >= MIN_BATCHES) {
            const { slope, next } = trend(values);
            const last = values[values.length - 1];
            forecastText = `Forecast next batch: ${next.toFixed(1)}%`;
            if (last >= HIGH_RATE) {
              status = { text: "High risk now", color: "bg-red-100 text-red-800" };
            } else if (next >= HIGH_RATE && slope > 0) {
              status = { text: "Early warning: heading toward high risk", color: "bg-red-100 text-red-800" };
            } else if (next >= WATCH_RATE && slope > 0) {
              status = { text: "Rising: keep watching", color: "bg-amber-100 text-amber-800" };
            } else {
              status = { text: "Stable", color: "bg-green-100 text-green-800" };
            }
          }

          const totals = CHECKS.map((c) => ({
            label: c.label,
            count: rows.reduce((s, r) => s + r[c.key], 0),
          }));
          const top = [...totals].sort((a, b) => b.count - a.count)[0];

          return (
            <div key={type} className="rounded-xl border p-5">
              <h3 className="font-semibold">{type}</h3>
              {values.length > 0 && <Spark values={values} />}
              <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                {status.text}
              </span>
              {forecastText && <p className="mt-2 text-sm text-gray-700">{forecastText}</p>}
              {top && top.count > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  Most common problem: {top.label} ({top.count} boxes)
                </p>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-gray-600">
        The forecast is a simple straight-line trend through recent batches, not machine learning. Treat it as an early hint, and trust it more as you record more batches with larger sample sizes.
      </p>
    </section>
  );
}