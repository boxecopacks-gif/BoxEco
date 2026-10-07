const steps = [
  "Lay the flat box on a clean table with the printed side facing down.",
  "Press firmly along every crease so the folds are sharp.",
  "Fold the side walls upward until they stand at 90 degrees.",
  "Fold the end flaps inward and lock the tabs into their slots.",
  "Close the lid and tuck the front flap in until it clicks.",
  "Check that corners are square and nothing is bulging.",
];

export default function Folding() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Folding Guide</h1>
      <p className="mt-2 text-gray-600">Example: mailer box assembly.</p>
      <ol className="mt-8 space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4 rounded-xl border p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-800 font-bold text-white">
              {i + 1}
            </span>
            <p>{s}</p>
          </li>
        ))}
      </ol>
    </main>
  );
}