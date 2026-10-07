const scenarios = [
  {
    q: "A customer says the box arrived crushed.",
    a: "Apologise, ask for a photo, and offer a replacement. Log the batch number.",
  },
  {
    q: "A customer asks if the box is recyclable.",
    a: "Yes, it is made from recycled board. Remove any tape or plastic before recycling.",
  },
  {
    q: "A customer cannot assemble the box.",
    a: "Point them to the Folding Guide and walk them through step 1 to 6.",
  },
];

export default function CustomerHandling() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Customer Handling</h1>
      <div className="mt-8 space-y-4">
        {scenarios.map((s) => (
          <div key={s.q} className="rounded-xl border p-5">
            <h2 className="font-semibold">{s.q}</h2>
            <p className="mt-2 text-gray-700">{s.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}