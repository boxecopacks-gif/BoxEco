type Scenario = {
  topic: string;
  situation: string;
  say: string;
  avoid: string;
};

const scenarios: Scenario[] = [
  {
    topic: "Assembly",
    situation: "A customer says they can't fold the box or the lid won't stay closed.",
    say: "Offer to walk them through it, or send the Folding Guide link for their box. For the gable box, check that the V-notches are hooked into the slits. For the meal box, check that the tuck is pushed fully into the slot.",
    avoid: "Don't suggest tape or glue. The boxes are designed to lock without it.",
  },
  {
    topic: "Damage",
    situation: "A box arrived crushed, bent, or with torn creases.",
    say: "Apologise, ask for a photo and the batch number, and offer a replacement. Pass the details to quality control.",
    avoid: "Don't blame the courier or the customer before checking the photo.",
  },
  {
    topic: "Hot or oily food",
    situation: "A customer asks whether the box can hold hot, wet, or oily food.",
    say: "Only confirm what has been tested for that specific box and material. If you are not sure, say you will check and come back to them.",
    avoid: "Don't promise leak-proof or heat-proof performance unless it is confirmed for that product.",
  },
  {
    topic: "Materials and recycling",
    situation: "A customer asks if the box is recyclable, compostable, or food safe.",
    say: "Share the material and certification details for that product, if you have them on record.",
    avoid: "Don't make eco or food-safety claims you cannot back up with a document or test report.",
  },
  {
    topic: "Sizing",
    situation: "A customer isn't sure which box fits their dish or portion.",
    say: "Ask what they are packing and how much. Then compare it with the sizes on the Products page and suggest the closest fit.",
    avoid: "Don't guess. Suggest ordering a sample first if they are unsure.",
  },
];

export default function CustomerHandling() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-green-900">Customer Handling</h1>
      <p className="mt-2 text-gray-600">
        How to respond to common customer situations.
      </p>
      <div className="mt-8 space-y-5">
        {scenarios.map((s) => (
          <div key={s.topic} className="rounded-xl border p-5">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-900">
              {s.topic}
            </span>
            <h2 className="mt-3 font-semibold">{s.situation}</h2>
            <p className="mt-3 text-gray-700">
              <span className="font-semibold text-green-900">Say: </span>
              {s.say}
            </p>
            <p className="mt-2 text-gray-700">
              <span className="font-semibold text-red-700">Avoid: </span>
              {s.avoid}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}