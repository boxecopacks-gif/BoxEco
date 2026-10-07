const products = [
  { name: "Mailer Box", material: "Recycled kraft board", use: "E-commerce shipping" },
  { name: "Gift Box", material: "FSC-certified paperboard", use: "Retail and gifting" },
  { name: "Food Box", material: "Food-safe uncoated board", use: "Bakery and takeaway" },
];

export default function Products() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Our Products</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {products.map((p) => (
          <div key={p.name} className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-2 text-sm text-gray-600">Material: {p.material}</p>
            <p className="text-sm text-gray-600">Best for: {p.use}</p>
          </div>
        ))}
      </div>
    </main>
  );
}