export interface XccShaderSettings {
  tapeWaveAmount: number;
  tapeJitterAmount: number;
  tapeJitterFrequency: number;
  tapeJitterSpeed: number;
  creaseFrequency: number;
  creaseSpeed: number;
  creaseThreshold: number;
  creaseWidth: number;
  creaseStrength: number;
  switchingNoiseHeight: number;
  switchingVerticalJump: number;
  switchingHorizontalJitter: number;
  bloomSpacing: number;
  bloomStrength: number;
  brightness: number;
  acBeatSpeed: number;
  acBeatStrength: number;
  acBeatThreshold: number;
  acBeatMaximum: number;
}

export type XccShaderSettingName = keyof XccShaderSettings;

export interface XccShaderControlDefinition {
  name: XccShaderSettingName;
  label: string;
  group: "Tape motion" | "Tape crease" | "Switching noise" | "Bloom and signal";
  min: number;
  max: number;
  step: number;
}

export const XCC_SHADER_CONTROLS: readonly XccShaderControlDefinition[] = [
  { name: "tapeWaveAmount", label: "Broad tape wave", group: "Tape motion", min: 0, max: 0.1, step: 0.0005 },
  { name: "tapeJitterAmount", label: "Fine tape jitter", group: "Tape motion", min: 0, max: 0.2, step: 0.0005 },
  { name: "tapeJitterFrequency", label: "Fine jitter density", group: "Tape motion", min: 0, max: 1000, step: 1 },
  { name: "tapeJitterSpeed", label: "Fine jitter speed", group: "Tape motion", min: 0, max: 100, step: 0.1 },
  { name: "creaseFrequency", label: "Crease density", group: "Tape crease", min: 0, max: 100, step: 0.1 },
  { name: "creaseSpeed", label: "Crease speed", group: "Tape crease", min: 0, max: 20, step: 0.05 },
  { name: "creaseThreshold", label: "Crease rarity", group: "Tape crease", min: -1, max: 1, step: 0.01 },
  { name: "creaseWidth", label: "Crease width", group: "Tape crease", min: 0, max: 0.25, step: 0.001 },
  { name: "creaseStrength", label: "Crease strength", group: "Tape crease", min: 0, max: 100, step: 0.1 },
  { name: "switchingNoiseHeight", label: "Bottom noise height", group: "Switching noise", min: 0, max: 1, step: 0.005 },
  { name: "switchingVerticalJump", label: "Bottom vertical jump", group: "Switching noise", min: 0, max: 1, step: 0.005 },
  { name: "switchingHorizontalJitter", label: "Bottom horizontal jitter", group: "Switching noise", min: 0, max: 1, step: 0.005 },
  { name: "bloomSpacing", label: "Color bleed spacing", group: "Bloom and signal", min: 0, max: 0.1, step: 0.0005 },
  { name: "bloomStrength", label: "Bloom strength", group: "Bloom and signal", min: 0, max: 1, step: 0.005 },
  { name: "brightness", label: "Final brightness", group: "Bloom and signal", min: 0, max: 2, step: 0.01 },
  { name: "acBeatSpeed", label: "AC beat speed", group: "Bloom and signal", min: 0, max: 5, step: 0.01 },
  { name: "acBeatStrength", label: "AC beat strength", group: "Bloom and signal", min: 0, max: 5, step: 0.01 },
  { name: "acBeatThreshold", label: "AC beat threshold", group: "Bloom and signal", min: -2, max: 2, step: 0.01 },
  { name: "acBeatMaximum", label: "AC beat maximum", group: "Bloom and signal", min: 0, max: 2, step: 0.01 },
];

// Shader2's supplied values are retained as the reset baseline. Cedalion is
// being used to find gentler permanent values by eye.
export const DEFAULT_XCC_SHADER_SETTINGS: Readonly<XccShaderSettings> = Object.freeze({
  tapeWaveAmount: 0.005,
  tapeJitterAmount: 0.01,
  tapeJitterFrequency: 100,
  tapeJitterSpeed: 10,
  creaseFrequency: 8,
  creaseSpeed: 1.2,
  creaseThreshold: 0.92,
  creaseWidth: 0.01,
  creaseStrength: 10,
  switchingNoiseHeight: 0.03,
  switchingVerticalJump: 0.3,
  switchingHorizontalJitter: 0.2,
  bloomSpacing: 0.007,
  bloomStrength: 0.1,
  brightness: 0.6,
  acBeatSpeed: 0.2,
  acBeatStrength: 0.6,
  acBeatThreshold: 0.25,
  acBeatMaximum: 0.1,
});

export function createDefaultXccShaderSettings(): XccShaderSettings {
  return { ...DEFAULT_XCC_SHADER_SETTINGS };
}
