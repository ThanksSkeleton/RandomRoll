import { buildXccSheet } from "./populate_xcc_template";
import { default_build } from "./xcc_impl";

const specimens = [
  { seed: "race-0", label: "No banner — Human non-Noble" },
  { seed: "stripe-139", label: "Noble banner — Human Nobility" },
  { seed: "race-1", label: "Nonhuman banner — Dwarf" },
  { seed: "race-81", label: "Nonhuman banner — Elf" },
  { seed: "race-24", label: "Nonhuman banner — Gnome" },
  { seed: "race-57", label: "Nonhuman banner — Half-Elf" },
  { seed: "race-55", label: "Nonhuman banner — Half-Orc" },
  { seed: "race-18", label: "Nonhuman banner — Halfling" },
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
  unit: "" | "px" | "rem" | "%" | "fr";
};

type ChoiceControl = {
  kind: "choice";
  group: string;
  label: string;
  property: string;
  defaultValue: string;
  options: ReadonlyArray<{ label: string; value: string }>;
};

type ColorControl = {
  kind: "color";
  group: string;
  label: string;
  property: string;
  defaultValue: string;
};

type ToggleControl = {
  kind: "toggle";
  group: string;
  label: string;
  property: string;
  defaultValue: boolean;
  enabledValue: string;
  disabledValue: string;
};

type CedalionControl = NumericControl | ChoiceControl | ColorControl | ToggleControl;

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

const portraitShapeOptions = [
  { label: "Square", value: "0rem" },
  { label: "Rounded", value: "1.5rem" },
] as const;

const controls: CedalionControl[] = [
  { kind: "numeric", group: "Font sizes", label: "XCrawl logo font size", property: "--xcc-logo-name-font-size", defaultValue: 3.56, min: 0.5, max: 8, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Font sizes", label: "Spotlight subtitle font size", property: "--xcc-logo-subtitle-font-size", defaultValue: 1.24, min: 0.35, max: 6, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Font sizes", label: "Banner font size", property: "--identity-stripe-font-size", defaultValue: 3.23, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Alignment", label: "All sheet text alignment", property: "--xcc-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Logo horizontal alignment", property: "--xcc-logo-horizontal-alignment", defaultValue: "start", options: elementAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Portrait horizontal alignment", property: "--xcc-portrait-horizontal-alignment", defaultValue: "end", options: elementAlignmentOptions },
  { kind: "choice", group: "Alignment", label: "Banner label horizontal alignment", property: "--identity-stripe-label-horizontal-alignment", defaultValue: "center", options: elementAlignmentOptions },
  { kind: "numeric", group: "Portrait", label: "Portrait border width", property: "--xcc-portrait-border-width", defaultValue: 0.7, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Portrait", label: "Portrait border shape", property: "--xcc-portrait-border-radius", defaultValue: "0rem", options: portraitShapeOptions },
  { kind: "numeric", group: "Banner geometry", label: "Banner bottom offset", property: "--identity-stripe-bottom", defaultValue: -14.24, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Banner geometry", label: "Banner left offset", property: "--identity-stripe-left", defaultValue: 6.31, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Banner geometry", label: "Banner width", property: "--identity-stripe-width", defaultValue: 188, min: 10, max: 500, step: 1, unit: "%" },
  { kind: "numeric", group: "Banner geometry", label: "Banner height", property: "--identity-stripe-height", defaultValue: 5.56, min: 0.25, max: 15, step: 0.01, unit: "rem" },

  { kind: "numeric", group: "Bio", label: "Bio font size", property: "--xcc-bio-font-size", defaultValue: 1.03, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Bio", label: "Whole bio horizontal alignment", property: "--xcc-bio-horizontal-alignment", defaultValue: "center", options: blockAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Label column text alignment", property: "--xcc-bio-label-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Value column text alignment", property: "--xcc-bio-value-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Bio", label: "Label/value vertical alignment", property: "--xcc-bio-row-vertical-alignment", defaultValue: "center", options: rowAlignmentOptions },
  { kind: "numeric", group: "Bio", label: "Label column width", property: "--xcc-bio-label-column-width", defaultValue: 10.19, min: 0.5, max: 30, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Bio", label: "Gap between label/value columns", property: "--xcc-bio-column-gap", defaultValue: 0.5, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Bio", label: "Gap between bio rows", property: "--xcc-bio-row-gap", defaultValue: 0.65, min: 0, max: 15, step: 0.01, unit: "rem" },

  { kind: "numeric", group: "Stats", label: "Stats font size", property: "--xcc-stats-font-size", defaultValue: 1.6, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Stats", label: "Vertical gap between stat rows", property: "--xcc-stats-row-gap", defaultValue: 1.87, min: 0, max: 10, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Stats", label: "Whole stats block horizontal alignment", property: "--xcc-stats-horizontal-alignment", defaultValue: "stretch", options: blockAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Base stats column vertical alignment", property: "--xcc-base-stats-vertical-alignment", defaultValue: "start", options: verticalColumnAlignmentOptions },
  { kind: "choice", group: "Stats", label: "Secondary stats column vertical alignment", property: "--xcc-secondary-stats-vertical-alignment", defaultValue: "start", options: verticalColumnAlignmentOptions },
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

  { kind: "numeric", group: "Weapon / Armor", label: "Weapon/armor font size", property: "--xcc-weapon-armor-font-size", defaultValue: 1.32, min: 0.25, max: 5, step: 0.01, unit: "rem" },
  { kind: "choice", group: "Weapon / Armor", label: "Whole weapon/armor block horizontal alignment", property: "--xcc-weapon-armor-horizontal-alignment", defaultValue: "center", options: blockAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Cells within each weapon/armor row", property: "--xcc-weapon-armor-row-vertical-alignment", defaultValue: "end", options: rowAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Left label column text alignment", property: "--xcc-weapon-left-label-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Left value column text alignment", property: "--xcc-weapon-left-value-text-align", defaultValue: "left", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Right label column text alignment", property: "--xcc-weapon-right-label-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "choice", group: "Weapon / Armor", label: "Right value column text alignment", property: "--xcc-weapon-right-value-text-align", defaultValue: "right", options: textAlignmentOptions },
  { kind: "numeric", group: "Weapon / Armor", label: "Gap between weapon/armor columns", property: "--xcc-weapon-armor-column-gap", defaultValue: 1.32, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Weapon / Armor", label: "Gap between weapon/armor rows", property: "--xcc-weapon-armor-row-gap", defaultValue: 0.79, min: 0, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Weapon / Armor", label: "Left value column width weight", property: "--xcc-weapon-left-value-column-weight", defaultValue: 2.1, min: 0.1, max: 10, step: 0.01, unit: "fr" },
  { kind: "numeric", group: "Weapon / Armor", label: "Right value column width weight", property: "--xcc-weapon-right-value-column-weight", defaultValue: 2.06, min: 0.1, max: 10, step: 0.01, unit: "fr" },

  { kind: "color", group: "Divider styling", label: "Shared divider color", property: "--xcc-divider-color", defaultValue: "#d8c52b" },

  { kind: "toggle", group: "Divider — XCrawl / Spotlight", label: "Show divider", property: "--xcc-divider-logo-name-subtitle-display", defaultValue: false, enabledValue: "block", disabledValue: "none" },
  { kind: "numeric", group: "Divider — XCrawl / Spotlight", label: "Width", property: "--xcc-divider-logo-name-subtitle-width", defaultValue: 0.1, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — XCrawl / Spotlight", label: "Height", property: "--xcc-divider-logo-name-subtitle-height", defaultValue: 100, min: 0, max: 300, step: 1, unit: "%" },
  { kind: "numeric", group: "Divider — XCrawl / Spotlight", label: "Left margin", property: "--xcc-divider-logo-name-subtitle-margin-left", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — XCrawl / Spotlight", label: "Right margin", property: "--xcc-divider-logo-name-subtitle-margin-right", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },

  { kind: "toggle", group: "Divider — Logo / Bio", label: "Show divider", property: "--xcc-divider-logo-bio-display", defaultValue: false, enabledValue: "block", disabledValue: "none" },
  { kind: "numeric", group: "Divider — Logo / Bio", label: "Width", property: "--xcc-divider-logo-bio-width", defaultValue: 100, min: 0, max: 300, step: 1, unit: "%" },
  { kind: "numeric", group: "Divider — Logo / Bio", label: "Height", property: "--xcc-divider-logo-bio-height", defaultValue: 0.1, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Logo / Bio", label: "Top margin", property: "--xcc-divider-logo-bio-margin-top", defaultValue: -2.09, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Logo / Bio", label: "Bottom margin", property: "--xcc-divider-logo-bio-margin-bottom", defaultValue: -0.21, min: -15, max: 15, step: 0.01, unit: "rem" },

  { kind: "toggle", group: "Divider — Bio / Stats", label: "Show divider", property: "--xcc-divider-bio-stats-display", defaultValue: true, enabledValue: "block", disabledValue: "none" },
  { kind: "numeric", group: "Divider — Bio / Stats", label: "Width", property: "--xcc-divider-bio-stats-width", defaultValue: 100, min: 0, max: 300, step: 1, unit: "%" },
  { kind: "numeric", group: "Divider — Bio / Stats", label: "Height", property: "--xcc-divider-bio-stats-height", defaultValue: 0.1, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Bio / Stats", label: "Top margin", property: "--xcc-divider-bio-stats-margin-top", defaultValue: -1.02, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Bio / Stats", label: "Bottom margin", property: "--xcc-divider-bio-stats-margin-bottom", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },

  { kind: "toggle", group: "Divider — Stats Columns", label: "Show divider", property: "--xcc-divider-stats-columns-display", defaultValue: false, enabledValue: "block", disabledValue: "none" },
  { kind: "numeric", group: "Divider — Stats Columns", label: "Width", property: "--xcc-divider-stats-columns-width", defaultValue: 0.1, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Stats Columns", label: "Height", property: "--xcc-divider-stats-columns-height", defaultValue: 100, min: 0, max: 300, step: 1, unit: "%" },
  { kind: "numeric", group: "Divider — Stats Columns", label: "Left margin", property: "--xcc-divider-stats-columns-margin-left", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Stats Columns", label: "Right margin", property: "--xcc-divider-stats-columns-margin-right", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },

  { kind: "toggle", group: "Divider — Stats / Weapon-Armor", label: "Show divider", property: "--xcc-divider-stats-weapon-armor-display", defaultValue: true, enabledValue: "block", disabledValue: "none" },
  { kind: "numeric", group: "Divider — Stats / Weapon-Armor", label: "Width", property: "--xcc-divider-stats-weapon-armor-width", defaultValue: 100, min: 0, max: 300, step: 1, unit: "%" },
  { kind: "numeric", group: "Divider — Stats / Weapon-Armor", label: "Height", property: "--xcc-divider-stats-weapon-armor-height", defaultValue: 0.1, min: 0, max: 5, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Stats / Weapon-Armor", label: "Top margin", property: "--xcc-divider-stats-weapon-armor-margin-top", defaultValue: -1.82, min: -15, max: 15, step: 0.01, unit: "rem" },
  { kind: "numeric", group: "Divider — Stats / Weapon-Armor", label: "Bottom margin", property: "--xcc-divider-stats-weapon-armor-margin-bottom", defaultValue: 0, min: -15, max: 15, step: 0.01, unit: "rem" },

  { kind: "color", group: "Banner colors — Nonhuman", label: "Dwarf banner", property: "--stripe-dwarf", defaultValue: "#8a4b2a" },
  { kind: "color", group: "Banner colors — Nonhuman", label: "Elf banner", property: "--stripe-elf", defaultValue: "#276749" },
  { kind: "color", group: "Banner colors — Nonhuman", label: "Gnome banner", property: "--stripe-gnome", defaultValue: "#654a91" },
  { kind: "color", group: "Banner colors — Nonhuman", label: "Half-Elf banner", property: "--stripe-half-elf", defaultValue: "#246f78" },
  { kind: "color", group: "Banner colors — Nonhuman", label: "Half-Orc banner", property: "--stripe-half-orc", defaultValue: "#87364a" },
  { kind: "color", group: "Banner colors — Nonhuman", label: "Halfling banner", property: "--stripe-halfling", defaultValue: "#8a6b20" },
];

type D1TextCategory = {
  id: "logo" | "yellow" | "white" | "nonhuman-stripe" | "noble-stripe";
  group: string;
  defaults: {
    face: string;
    edgeColor: string;
    edgeThickness: number;
    iterations: number;
    xStep: number;
    yStep: number;
    nearColor: string;
    farColor: string;
    transition: number;
    nearHold: number;
  };
};

const d1TextCategories: readonly D1TextCategory[] = [
  {
    id: "logo",
    group: "Artistic Text — Logo",
    defaults: {
      face: "#ffffff",
      edgeColor: "#000000",
      edgeThickness: 1.75,
      iterations: 13,
      xStep: 0.25,
      yStep: 0.7,
      nearColor: "#9e9e9e",
      farColor: "#050b55",
      transition: 0.5,
      nearHold: 0,
    },
  },
  {
    id: "yellow",
    group: "Artistic Text — Yellow",
    defaults: {
      face: "#ffe72e",
      edgeColor: "#000000",
      edgeThickness: 1,
      iterations: 8,
      xStep: 0.35,
      yStep: 0.45,
      nearColor: "#b83700",
      farColor: "#000000",
      transition: 0.67,
      nearHold: 1,
    },
  },
  {
    id: "white",
    group: "Artistic Text — White",
    defaults: {
      face: "#ffffff",
      edgeColor: "#000000",
      edgeThickness: 1,
      iterations: 9,
      xStep: 0.7,
      yStep: 0.5,
      nearColor: "#686b86",
      farColor: "#050b55",
      transition: 0.45,
      nearHold: 1,
    },
  },
  {
    id: "nonhuman-stripe",
    group: "Artistic Text — Nonhuman Banner",
    defaults: {
      face: "#ffffff",
      edgeColor: "#000000",
      edgeThickness: 1,
      iterations: 0,
      xStep: 0.6,
      yStep: -0.45,
      nearColor: "#000000",
      farColor: "#050b55",
      transition: 0.25,
      nearHold: 1,
    },
  },
  {
    id: "noble-stripe",
    group: "Artistic Text — Noble Banner",
    defaults: {
      face: "#ffffff",
      edgeColor: "#000000",
      edgeThickness: 1,
      iterations: 0,
      xStep: 0.6,
      yStep: -0.45,
      nearColor: "#000000",
      farColor: "#050b55",
      transition: 0.25,
      nearHold: 1,
    },
  },
] as const;

function d1Property(category: D1TextCategory, suffix: string): string {
  return `--xcc-${category.id}-d1-${suffix}`;
}

for (const category of d1TextCategories) {
  controls.push(
    { kind: "color", group: category.group, label: "Face color", property: d1Property(category, "face"), defaultValue: category.defaults.face },
    { kind: "color", group: category.group, label: "Surround edge color", property: d1Property(category, "edge-color"), defaultValue: category.defaults.edgeColor },
    { kind: "numeric", group: category.group, label: "Surround edge thickness", property: d1Property(category, "edge-thickness"), defaultValue: category.defaults.edgeThickness, min: 0, max: 8, step: 0.25, unit: "px" },
    { kind: "numeric", group: category.group, label: "Shadow iterations", property: d1Property(category, "iterations"), defaultValue: category.defaults.iterations, min: 0, max: 32, step: 1, unit: "" },
    { kind: "numeric", group: category.group, label: "Horizontal step per iteration", property: d1Property(category, "x-step"), defaultValue: category.defaults.xStep, min: -8, max: 12, step: 0.05, unit: "px" },
    { kind: "numeric", group: category.group, label: "Vertical step per iteration", property: d1Property(category, "y-step"), defaultValue: category.defaults.yStep, min: -8, max: 12, step: 0.05, unit: "px" },
    { kind: "color", group: category.group, label: "Near shadow color", property: d1Property(category, "near-color"), defaultValue: category.defaults.nearColor },
    { kind: "color", group: category.group, label: "Far shadow color", property: d1Property(category, "far-color"), defaultValue: category.defaults.farColor },
    { kind: "numeric", group: category.group, label: "Color transition", property: d1Property(category, "transition"), defaultValue: category.defaults.transition, min: 0, max: 1, step: 0.01, unit: "" },
    { kind: "numeric", group: category.group, label: "Near-color hold", property: d1Property(category, "near-hold"), defaultValue: category.defaults.nearHold, min: 0, max: 32, step: 1, unit: "" },
  );
}

const portraitFrameD1Defaults = {
  borderColor: "#d8c52b",
  iterations: 8,
  xStep: 0.5,
  yStep: 1.25,
  nearColor: "#bd9f32",
  farColor: "#0b17c1",
  transition: 0.66,
  nearHold: 4,
} as const;

controls.push(
  { kind: "color", group: "Artistic Portrait Frame", label: "Frame color", property: "--xcc-portrait-frame-d1-border-color", defaultValue: portraitFrameD1Defaults.borderColor },
  { kind: "numeric", group: "Artistic Portrait Frame", label: "Shadow iterations", property: "--xcc-portrait-frame-d1-iterations", defaultValue: portraitFrameD1Defaults.iterations, min: 0, max: 32, step: 1, unit: "" },
  { kind: "numeric", group: "Artistic Portrait Frame", label: "Horizontal step per iteration", property: "--xcc-portrait-frame-d1-x-step", defaultValue: portraitFrameD1Defaults.xStep, min: -8, max: 12, step: 0.05, unit: "px" },
  { kind: "numeric", group: "Artistic Portrait Frame", label: "Vertical step per iteration", property: "--xcc-portrait-frame-d1-y-step", defaultValue: portraitFrameD1Defaults.yStep, min: -8, max: 12, step: 0.05, unit: "px" },
  { kind: "color", group: "Artistic Portrait Frame", label: "Near shadow color", property: "--xcc-portrait-frame-d1-near-color", defaultValue: portraitFrameD1Defaults.nearColor },
  { kind: "color", group: "Artistic Portrait Frame", label: "Far shadow color", property: "--xcc-portrait-frame-d1-far-color", defaultValue: portraitFrameD1Defaults.farColor },
  { kind: "numeric", group: "Artistic Portrait Frame", label: "Color transition", property: "--xcc-portrait-frame-d1-transition", defaultValue: portraitFrameD1Defaults.transition, min: 0, max: 1, step: 0.01, unit: "" },
  { kind: "numeric", group: "Artistic Portrait Frame", label: "Near-color hold", property: "--xcc-portrait-frame-d1-near-hold", defaultValue: portraitFrameD1Defaults.nearHold, min: 0, max: 32, step: 1, unit: "" },
);

const liveState = new Map<string, string>();
const fieldResets: Array<() => void> = [];
const sheets = [...document.querySelectorAll<HTMLElement>(".xcc-sheet")];

function parseHexColor(value: string): { r: number; g: number; b: number } {
  const hex = value.replace("#", "");
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function mixHexColors(from: string, to: string, amount: number): string {
  const start = parseHexColor(from);
  const end = parseHexColor(to);
  const mix = (a: number, b: number): number => Math.round(a + (b - a) * amount);
  return `rgb(${mix(start.r, end.r)}, ${mix(start.g, end.g)}, ${mix(start.b, end.b)})`;
}

function formatPixelValue(value: number): string {
  return String(Number(value.toFixed(4)));
}

function refreshD1Style(category: D1TextCategory): void {
  const properties = {
    face: d1Property(category, "face"),
    edgeColor: d1Property(category, "edge-color"),
    edgeThickness: d1Property(category, "edge-thickness"),
    iterations: d1Property(category, "iterations"),
    xStep: d1Property(category, "x-step"),
    yStep: d1Property(category, "y-step"),
    nearColor: d1Property(category, "near-color"),
    farColor: d1Property(category, "far-color"),
    transition: d1Property(category, "transition"),
    nearHold: d1Property(category, "near-hold"),
  };

  if (Object.values(properties).some((property) => !liveState.has(property))) {
    return;
  }

  const numericValue = (property: string): number =>
    Number.parseFloat(liveState.get(property) ?? "0");
  const face = liveState.get(properties.face) ?? category.defaults.face;
  const edgeColor = liveState.get(properties.edgeColor) ?? category.defaults.edgeColor;
  const edgeThickness = numericValue(properties.edgeThickness);
  const iterations = Math.max(0, Math.round(numericValue(properties.iterations)));
  const xStep = numericValue(properties.xStep);
  const yStep = numericValue(properties.yStep);
  const nearColor = liveState.get(properties.nearColor) ?? category.defaults.nearColor;
  const farColor = liveState.get(properties.farColor) ?? category.defaults.farColor;
  const transition = numericValue(properties.transition);
  const nearHold = Math.max(0, Math.round(numericValue(properties.nearHold)));
  const shadows: string[] = [];

  if (edgeThickness > 0) {
    for (const [x, y] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      shadows.push(`${formatPixelValue(x * edgeThickness)}px ${formatPixelValue(y * edgeThickness)}px 0 ${edgeColor}`);
    }
  }

  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    let colorAmount = 0;
    if (iteration > nearHold) {
      const rawAmount = (iteration - nearHold) / Math.max(1, iterations - nearHold);
      if (transition <= 0) {
        colorAmount = 1;
      } else if (transition >= 1) {
        colorAmount = rawAmount >= 1 ? 1 : 0;
      } else {
        const gamma = Math.log(0.5) / Math.log(Math.max(0.001, transition));
        colorAmount = Math.pow(rawAmount, gamma);
      }
    }

    const color = mixHexColors(
      nearColor,
      farColor,
      Math.min(1, Math.max(0, colorAmount)),
    );
    shadows.push(`${formatPixelValue(xStep * iteration)}px ${formatPixelValue(yStep * iteration)}px 0 ${color}`);
  }

  for (const sheet of sheets) {
    sheet.style.setProperty(`--xcc-${category.id}-face-color`, face);
    sheet.style.setProperty(`--xcc-${category.id}-text-shadow`, shadows.join(", "));
  }
}

function refreshPortraitFrameD1Style(): void {
  const properties = {
    borderColor: "--xcc-portrait-frame-d1-border-color",
    iterations: "--xcc-portrait-frame-d1-iterations",
    xStep: "--xcc-portrait-frame-d1-x-step",
    yStep: "--xcc-portrait-frame-d1-y-step",
    nearColor: "--xcc-portrait-frame-d1-near-color",
    farColor: "--xcc-portrait-frame-d1-far-color",
    transition: "--xcc-portrait-frame-d1-transition",
    nearHold: "--xcc-portrait-frame-d1-near-hold",
  } as const;

  if (Object.values(properties).some((property) => !liveState.has(property))) {
    return;
  }

  const numericValue = (property: string): number =>
    Number.parseFloat(liveState.get(property) ?? "0");
  const borderColor = liveState.get(properties.borderColor) ?? portraitFrameD1Defaults.borderColor;
  const iterations = Math.max(0, Math.round(numericValue(properties.iterations)));
  const xStep = numericValue(properties.xStep);
  const yStep = numericValue(properties.yStep);
  const nearColor = liveState.get(properties.nearColor) ?? portraitFrameD1Defaults.nearColor;
  const farColor = liveState.get(properties.farColor) ?? portraitFrameD1Defaults.farColor;
  const transition = numericValue(properties.transition);
  const nearHold = Math.max(0, Math.round(numericValue(properties.nearHold)));
  const shadows: string[] = [];

  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    let colorAmount = 0;
    if (iteration > nearHold) {
      const rawAmount = (iteration - nearHold) / Math.max(1, iterations - nearHold);
      if (transition <= 0) {
        colorAmount = 1;
      } else if (transition >= 1) {
        colorAmount = rawAmount >= 1 ? 1 : 0;
      } else {
        const gamma = Math.log(0.5) / Math.log(Math.max(0.001, transition));
        colorAmount = Math.pow(rawAmount, gamma);
      }
    }

    const color = mixHexColors(
      nearColor,
      farColor,
      Math.min(1, Math.max(0, colorAmount)),
    );
    shadows.push(`${formatPixelValue(xStep * iteration)}px ${formatPixelValue(yStep * iteration)}px 0 0 ${color}`);
  }

  for (const sheet of sheets) {
    sheet.style.setProperty("--xcc-portrait-border-color", borderColor);
    sheet.style.setProperty(
      "--xcc-portrait-frame-box-shadow",
      shadows.length > 0 ? shadows.join(", ") : "none",
    );
  }
}

function refreshD1Styles(): void {
  for (const category of d1TextCategories) refreshD1Style(category);
  refreshPortraitFrameD1Style();
}

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

function createSupercategory(name: string): {
  details: HTMLDetailsElement;
  content: HTMLDivElement;
} {
  const details = document.createElement("details");
  details.className = "cedalion-supercategory";

  const summary = document.createElement("summary");
  summary.textContent = name;

  const content = document.createElement("div");
  content.className = "cedalion-supercategory-content";
  details.append(summary, content);
  controlsContainer.append(details);
  return { details, content };
}

const globalSupercategory = createSupercategory("Global / Meta");
const sectionsSupercategory = createSupercategory("Sections");
const globalCategories = new Map<string, HTMLDivElement>();
const localizedSections = new Map<string, HTMLDivElement>();
const globalGroupNames = new Set(["Font sizes", "Alignment", "Divider styling"]);

function updateStateBox(): void {
  stateBox.value = JSON.stringify(Object.fromEntries(liveState), null, 2);
}

function applyProperty(property: string, value: string): void {
  for (const sheet of sheets) {
    sheet.style.setProperty(property, value);
  }
  liveState.set(property, value);
  refreshD1Styles();
  updateStateBox();
}

function getControlContainer(name: string): HTMLElement {
  if (globalGroupNames.has(name)) {
    const existing = globalCategories.get(name);
    if (existing) return existing;

    const category = document.createElement("details");
    category.className = "cedalion-category";
    const summary = document.createElement("summary");
    summary.textContent = name;
    const settings = document.createElement("div");
    settings.className = "cedalion-category-settings";
    category.append(summary, settings);
    globalSupercategory.content.append(category);
    globalCategories.set(name, settings);
    return settings;
  }

  const existing = localizedSections.get(name);
  if (existing) return existing;

  const section = document.createElement("details");
  section.className = "cedalion-section";
  const summary = document.createElement("summary");
  summary.textContent = name;
  const settings = document.createElement("div");
  settings.className = "cedalion-section-settings";
  section.append(summary, settings);
  sectionsSupercategory.content.append(section);
  localizedSections.set(name, settings);
  return settings;
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
  } else if (control.kind === "choice") {
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
  } else if (control.kind === "color") {
    const color = document.createElement("input");
    color.id = inputId;
    color.type = "color";

    const setValue = (value: string): void => {
      color.value = value;
      applyProperty(control.property, value);
    };

    color.addEventListener("input", () => setValue(color.value));
    reset.addEventListener("click", () => setValue(control.defaultValue));
    fieldResets.push(() => setValue(control.defaultValue));
    field.append(color, reset);
    setValue(control.defaultValue);
  } else {
    const toggle = document.createElement("input");
    toggle.id = inputId;
    toggle.type = "checkbox";

    const setValue = (value: boolean): void => {
      toggle.checked = value;
      applyProperty(
        control.property,
        value ? control.enabledValue : control.disabledValue,
      );
    };

    toggle.addEventListener("change", () => setValue(toggle.checked));
    reset.addEventListener("click", () => setValue(control.defaultValue));
    fieldResets.push(() => setValue(control.defaultValue));
    field.append(toggle, reset);
    setValue(control.defaultValue);
  }

  getControlContainer(control.group).append(field);
});

resetAll.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Reset every Cedalion setting to its baked default?",
  );
  if (!confirmed) return;

  for (const reset of fieldResets) reset();
});

panel.append(panelHeader, controlsContainer);
document.body.append(panel);
