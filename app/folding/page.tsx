type Guide = {
  id: string;
  name: string;
  note: string;
  steps: string[];
};

const guides: Guide[] = [
  {
    id: "gable",
    name: "Gable Handle Box (glue-free)",
    note: "Base 200 × 110 mm, wall 60 mm. No glue or tape needed.",
    steps: [
      "Lay the flat sheet on a clean table with the printed side down.",
      "Press along every dashed fold line so the creases are sharp.",
      "Fold the back and front walls up to 90 degrees.",
      "Fold the two end walls up so they stand against the back and front walls.",
      "Fold each corner pleat inward along its diagonal line, so it lies flat against the inside of the wall. This holds the corners square.",
      "Fold the gable triangles on both ends inward until they lean toward each other at the top.",
      "Bring the back and front handle panels up and together over the top, so the two handle holes line up.",
      "Hook the V-notches on the handle panels into the slits in the gable ends. Pull gently to confirm the lock is firm.",
    ],
  },
  {
    id: "meal",
    name: "Takeaway Meal Box",
    note: "Top 216 × 160 mm, bottom 197 × 140 mm, height 90 mm.",
    steps: [
      "Lay the flat sheet printed side down and crease all fold lines.",
      "Fold the back and front walls up from the base.",
      "Fold the two end walls up.",
      "Fold each corner pleat inward along its diagonal so the corners stay tight.",
      "Fold the lid over the top from the back wall.",
      "Push the tuck at the end of the lid into the slot on the front wall until it holds.",
    ],
  },
  {
    id: "hexagon",
    name: "Hexagon Box (tray and lid)",
    note: "Tray: side 60 mm, wall 40 mm. Lid: side 62 mm, wall 35 mm.",
    steps: [
      "Take the tray sheet and crease all dashed lines around the hexagon floor.",
      "Fold all six walls up from the floor.",
      "Fold each corner pleat inward along its centre line so it lies flat against the wall. The pleats hold the walls up without glue.",
      "Repeat steps 1 to 3 for the lid sheet.",
      "Place the lid over the tray. It is slightly larger, so it should sit down over the walls.",
      "Check that all six corners are tight and the lid closes evenly.",
    ],
  },
];

export default function Folding() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Folding Guide</h1>
      <p className="mt-2 text-gray-600">Choose a box to see how to assemble it.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {guides.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-green-800 px-4 py-1 text-sm text-green-900 hover:bg-green-800 hover:text-white"
          >
            {g.name}
          </a>
        ))}
      </div>

      {guides.map((g) => (
        <section key={g.id} id={g.id} className="mt-12 scroll-mt-6">
          <h2 className="text-2xl font-semibold text-green-900">{g.name}</h2>
          <p className="mt-1 text-sm text-gray-600">{g.note}</p>
          <ol className="mt-6 space-y-3">
            {g.steps.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-xl border p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-800 font-bold text-white">
                  {i + 1}
                </span>
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}