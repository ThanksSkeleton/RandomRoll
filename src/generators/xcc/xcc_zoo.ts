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

type NumericControl = {
  kind: "numeric";
  group: string;
  label: string;
  property: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: "rem" | "%" | "fr";
};

type ChoiceControl = {
  kind: "choice";
  group: string;
  label: string;
  property: string;
  defaultValue: string;
  options: ReadonlyArray<{ label: string; value: string }>;
};

type CedalionControl = NumericControl | ChoiceControl;

const textAlignmentOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
] as const;

const elementAlignmentOptions = [
  { label: "Left", value: "start" },
  { label: "Center", value: "center" },
  { label: "Right", value: "end" },
] as const;

const blockAlignmentOptions = [
  { label: "Stretch (current)", value: "stretch" },
  ...elementAlignmentOptions,
] as const;

const rowAlignmentOptions = [
  { label: "Baseline", value: "baseline" },
  { label: "Top", value: "start" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "end" },
] as const;

const verticalColumnAlignmentOptions = [
  { label: "Stretch (current)", value: "stretch" },
  { label: "Top", value: "start" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "end" },
] as const;

const controls: CedalionControl[] = [
  { kind: "numeric", group: "Font sizes", label: "Content font size", property: "--xcc-content-font-size", defaultValue: 1.25, min: 0.35, max: 4, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Font sizes", label: "XCrawl logo font size", property: "--xcc-logo-name-font-size", defaultValue: 3.29, min: 0.5, max: 8, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Font sizes", label: "Spotlight subtitle font size", property: "--xcc-logo-subtitle-font-size", defaultValue: 1.16, min: 0.35, max: 6, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Font sizes", label: "Banner font size", property: "--identity-stripe-font-size", defaultValue: 3.23, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Alignment", label: "All sheet text alignment", property: "--xcc-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Logo horizontal alignment", property: "--xcc-logo-horizontal-alignment", defaultValue: "start", options: elementAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Portrait horizontal alignment", property: "--xcc-portrait-horizontal-alignment", defaultValue: "end", options: elementAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Banner label horizontal alignment", property: "--identity-stripe-label-horizontal-alignment", defaultValue: "center", options: elementAlignmentOptions },
  { kind: "numeric", group: "Banner geometry", label: "Banner bottom offset", property: "--identity-stripe-bottom", defaultValue: -14.24, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Banner geometry", label: "Banner left offset", property: "--identity-stripe-left", defaultValue: 6.31, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Banner geometry", label: "Banner width", property: "--identity-stripe-width", defaultValue: 188, min: 10, max: 500, step: 1, unit: "%" },
  { kind: "numeric", group: "Banner geometry", label: "Banner height", property: "--identity-stripe-height", defaultValue: 5.56, min: 0.25, max: 15, step: 0.01, unit: "rem" },

  { kind: "numeric", group: "Bio", label: "Bio font size", property: "--xcc-bio-font-size", defaultValue: 1.08, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Bio", label: "Whole bio horizontal alignment", property: "--xcc-bio-horizontal-alignment", defaultValue: "center", options: blockAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Label column text alignment", property: "--xcc-bio-label-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Value column text alignment", property: "--xcc-bio-value-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Label/value vertical alignment", property: "--xcc-bio-row-vertical-alignment", defaultValue: "center", options: rowAlignmentOptions },
  { kind: "numeric", group: "Bio", label: "Label column width", property: "--xcc-bio-label-column-width", defaultValue: 11.46, min: 0.5, max: 30, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Bio", label: "Gap between label/value columns", property: "--xcc-bio-column-gap", defaultValue: 0.5, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Bio", label: "Gap between bio rows", property: "--xcc-bio-row-gap", defaultValue: 0.65, min: 0, max: 15, step: 0.01, unit: "rem" },

  { kind: "numeric", group: "Stats", label: "Stats font size", property: "--xcc-stats-font-size", defaultValue: 1.6, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Stats", label: "Whole stats block horizontal alignment", property: "--xcc-stats-horizontal-alignment", defaultValue: "stretch", options: blockAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Base stats column vertical alignment", property: "--xcc-base-stats-vertical-alignment", defaultValue: "stretch", options: verticalColumnAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Secondary stats column vertical alignment", property: "--xcc-secondary-stats-vertical-alignment", defaultValue: "stretch", options: verticalColumnAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Cells within each stats row", property: "--xcc-stats-row-vertical-alignment", defaultValue: "center", options: rowAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Base label column text alignment", property: "--xcc-base-stat-label-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Base score column text alignment", property: "--xcc-base-stat-score-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Base modifier column text alignment", property: "--xcc-base-stat-modifier-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Secondary label column text alignment", property: "--xcc-secondary-stat-label-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Secondary value column text alignment", property: "--xcc-secondary-stat-value-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "numeric", group: "Stats", label: "Gap between base/secondary columns", property: "--xcc-stats-column-gap", defaultValue: 3.97, min: 0, max: 20, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Stats", label: "Base stats column width weight", property: "--xcc-stats-base-column-weight", defaultValue: 1.64, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Stats", label: "Secondary stats column width weight", property: "--xcc-stats-secondary-column-weight", defaultValue: 1.64, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Stats", label: "Gap inside base-stat columns", property: "--xcc-base-stat-column-gap", defaultValue: 2.34, min: 0, max: 10, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Stats", label: "Gap inside secondary-stat columns", property: "--xcc-secondary-stat-column-gap", defaultValue: 1.24, min: 0, max: 10, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Stats", label: "Base label column width weight", property: "--xcc-base-stat-label-column-weight", defaultValue: 2.84, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Stats", label: "Base score column width weight", property: "--xcc-base-stat-score-column-weight", defaultValue: 1.87, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Stats", label: "Base modifier column width weight", property: "--xcc-base-stat-modifier-column-weight", defaultValue: 1.95, min: 0.1, max: 10, step: 0.01, unit: "fr" },

  { kind: "numeric", group: "Weapon / Armor", label: "Weapon/armor font size", property: "--xcc-weapon-armor-font-size", defaultValue: 1.14, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Weapon / Armor", label: "Whole weapon/armor block horizontal alignment", property: "--xcc-weapon-armor-horizontal-alignment", defaultValue: "center", options: blockAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Cells within each weapon/armor row", property: "--xcc-weapon-armor-row-vertical-alignment", defaultValue: "end", options: rowAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Left label column text alignment", property: "--xcc-weapon-left-label-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Left value column text alignment", property: "--xcc-weapon-left-value-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Right label column text alignment", property: "--xcc-weapon-right-label-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Right value column text alignment", property: "--xcc-weapon-right-value-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "numeric", group: "Weapon / Armor", label: "Gap between weapon/armor columns", property: "--xcc-weapon-armor-column-gap", defaultValue: 1.32, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Weapon / Armor", label: "Gap between weapon/armor rows", property: "--xcc-weapon-armor-row-gap", defaultValue: 1.21, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Weapon / Armor", label: "Left value column width weight", property: "--xcc-weapon-left-value-column-weight", defaultValue: 2.34, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Weapon / Armor", label: "Right value column width weight", property: "--xcc-weapon-right-value-column-weight", defaultValue: 2.06, min: 0.1, max: 10, step: 0.01, unit: "fr" },
];

const liveState = new Map<string, string>();
const fieldResets: Array<() => void> = [];
const sheets = [...document.querySelectorAll<HTMLElement>(".xcc-sheet")];

const panel = document.createElement("aside");
panel.className = "cedalion-panel";
panel.setAttribute("aria-label", "Temporary Cedalion tuning controls");

const panelHeader = document.createElement("div");
panelHeader.className = "cedalion-panel-header";

const panelTitle = document.createElement("h2");
panelTitle.textContent = "Cedalion — temporary controls";

const panelDescription = document.createElement("p");
panelDescription.textContent = "Live state (read-only; copy manually):";

const stateBox = document.createElement("textarea");
stateBox.className = "cedalion-state";
stateBox.readOnly = true;
stateBox.setAttribute("aria-label", "Complete Cedalion live state JSON");

const resetAll = document.createElement("button");
resetAll.className = "cedalion-reset-all";
resetAll.type = "button";
resetAll.textContent = "Reset entire panel";

panelHeader.append(panelTitle, panelDescription, stateBox, resetAll);

const controlsContainer = document.createElement("div");
controlsContainer.className = "cedalion-controls";
const groups = new Map<string, HTMLFieldSetElement>();

function updateStateBox(): void {
  stateBox.value = JSON.stringify(Object.fromEntries(liveState), null, 2);
}

function applyProperty(property: string, value: string): void {
  for (const sheet of sheets) {
    sheet.style.setProperty(property, value);
  }
  liveState.set(property, value);
  updateStateBox();
}

function getGroup(name: string): HTMLFieldSetElement {
  const existing = groups.get(name);
  if (existing) return existing;

  const fieldset = document.createElement("fieldset");
  fieldset.className = "cedalion-group";
  const legend = document.createElement("legend");
  legend.textContent = name;
  fieldset.append(legend);
  controlsContainer.append(fieldset);
  groups.set(name, fieldset);
  return fieldset;
}

controls.forEach((control, index) => {
  const field = document.createElement("div");
  field.className = "cedalion-field";

  const label = document.createElement("label");
  const inputId = `cedalion-${index}`;
  label.htmlFor = inputId;
  label.textContent = `${control.label} (${control.property})`;

  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reset";
  reset.setAttribute("aria-label", `Reset ${control.label}`);

  field.append(label);

  if (control.kind === "numeric") {
    const range = document.createElement("input");
    range.id = inputId;
    range.type = "range";
    range.min = String(control.min);
    range.max = String(control.max);
    range.step = String(control.step);

    const exact = document.createElement("input");
    exact.type = "number";
    exact.min = String(control.min);
    exact.max = String(control.max);
    exact.step = String(control.step);
    exact.setAttribute("aria-label", `${control.label} exact value`);

    const setValue = (value: number): void => {
      if (!Number.isFinite(value)) return;
      range.value = String(value);
      exact.value = String(value);
      applyProperty(control.property, `${value}${control.unit}`);
    };

    range.addEventListener("input", () => setValue(range.valueAsNumber));
    exact.addEventListener("input", () => setValue(exact.valueAsNumber));
    reset.addEventListener("click", () => setValue(control.defaultValue));
    fieldResets.push(() => setValue(control.defaultValue));
    field.append(range, exact, reset);
    setValue(control.defaultValue);
  } else {
    const select = document.createElement("select");
    select.id = inputId;
    for (const optionDefinition of control.options) {
      const option = document.createElement("option");
      option.value = optionDefinition.value;
      option.textContent = optionDefinition.label;
      select.append(option);
    }

    const setValue = (value: string): void => {
      select.value = value;
      applyProperty(control.property, value);
    };

    select.addEventListener("change", () => setValue(select.value));
    reset.addEventListener("click", () => setValue(control.defaultValue));
    fieldResets.push(() => setValue(control.defaultValue));
    field.append(select, reset);
    setValue(control.defaultValue);
  }

  getGroup(control.group).append(field);
});

resetAll.addEventListener("click", () => {
  for (const reset of fieldResets) reset();
});

panel.append(panelHeader, controlsContainer);
document.body.append(panel);
