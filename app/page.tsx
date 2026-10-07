import Link from "next/link";

const sections = [
  {
    href: "/products",
    title: "Our Products",
    text: "Gable handle boxes, takeaway meal boxes and hexagon boxes, with sizes and features.",
  },
  {
    href: "/folding",
    title: "Folding Guide",
    text: "Step-by-step assembly for every box. No glue or tape needed.",
  },
  {
    href: "/customer-handling",
    title: "Customer Handling",
    text: "What to say, and what to avoid, in common customer situations.",
  },
];

// Change your contact details here
const CONTACT = {
  email: "boxecopacks@gmail.com",
  phones: [
    { display: "+91 8589895174", link: "+91 8589895174" },
    { display: "+91 7025798349", link: "+91 7025798349" },
  ],
};

export default function Home() {
  return (
    <main>
      <section className="bg-green-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-800">
            Eco-friendly food packaging
          </p>
          <h1 className="mt-3 text-4xl font-bold text-green-900 sm:text-5xl">
            Packaging that folds in seconds and holds up on delivery
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-700">
            Learn our boxes, assemble them correctly, and look after every
            customer with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-green-800 px-6 py-3 font-semibold text-white hover:bg-green-900"
            >
              See our products
            </Link>
            <Link
              href="/folding"
              className="rounded-lg border border-green-800 px-6 py-3 font-semibold text-green-900 hover:bg-green-100"
            >
              How to fold a box
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="grid gap-6 sm:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-xl border p-6 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-green-900">{s.title}</h2>
              <p className="mt-2 text-gray-600">{s.text}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-xl border bg-gray-50 p-6">
          <h2 className="text-lg font-semibold">For BoxEco staff</h2>
          <p className="mt-1 text-gray-600">
            Log inspection results and check batch quality trends.
          </p>
          <Link
            href="/quality"
            className="mt-4 inline-block font-semibold text-green-800 underline"
          >
            Open the quality dashboard
          </Link>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-gray-600">
        <p className="font-semibold text-gray-800">BoxEco</p>
        <p className="mt-2">
          Email:{" "}
          <a href={`mailto:${CONTACT.email}`} className="underline">
            {CONTACT.email}
          </a>
        </p>
        {CONTACT.phones.map((p) => (
          <p key={p.link} className="mt-1">
            Phone:{" "}
            <a href={`tel:${p.link}`} className="underline">
              {p.display}
            </a>
          </p>
        ))}
      </footer>
    </main>
  );
}