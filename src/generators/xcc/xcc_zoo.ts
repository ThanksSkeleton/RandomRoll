import { buildXccSheet } from "./populate_xcc_template";
import { default_build } from "./xcc_impl";

const specimens = [
  { seed: "stripe-0", label: "No banner — Human non-Noble" },
  { seed: "stripe-7", label: "Race banner — Gnome" },
  { seed: "stripe-139", label: "Noble banner — Human Nobility" },
] as const;

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Missing #app element.");
}

for (const specimen of specimens) {
  const section = document.createElement("section");
  section.className = "zoo-specimen";
  section.dataset.seed = specimen.seed;

  const heading = document.createElement("h2");
  heading.textContent = `${specimen.label} · ${specimen.seed}`;

  const generated = default_build(specimen.seed);
  section.append(heading, buildXccSheet(generated.objects));
  app.append(section);
}
