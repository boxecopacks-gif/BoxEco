type Product = {
  name: string;
  tagline: string;
  size: string;
  features: string[];
  image?: string; // e.g. "/products/gable-box.jpg" once you add your own photo
};

const products: Product[] = [
  {
    name: "Gable Handle Box",
    tagline: "Carry-handle box for meals and parcels",
    size: "200 × 110 mm base, 60 mm wall",
    features: ["Built-in carry handle", "Lockable V-notch closure", "Flat-packed, folds in seconds"],
  },
  {
    name: "Takeaway Meal Box",
    tagline: "Classic folding box for hot meals",
    size: "Top 216 × 160 mm, bottom 197 × 140 mm, 90 mm high",
    features: ["Pleated corners", "Tuck-in lid", "Kraft board"],
  },
  {
    name: "Hexagon Box",
    tagline: "Distinctive box for premium parcels",
    size: "Base side 60 mm (wall 40 mm), lid side 62 mm (wall 35 mm)",
    features: ["Glue-free pleated corners", "Separate tray and lid", "Stands out on the table"],
  },
];

export default function Products() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Our Products</h1>
      <p className="mt-2 text-gray-600">Eco-friendly food and parcel packaging.</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.name} className="rounded-xl border p-6">
            {p.image && (
              <img src={p.image} alt={p.name} className="mb-4 h-48 w-full rounded-lg object-cover" />
            )}
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{p.tagline}</p>
            <p className="mt-3 text-sm font-medium">Size: {p.size}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}