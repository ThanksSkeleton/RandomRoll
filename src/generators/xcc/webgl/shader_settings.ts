export interface XccShaderSettings {
  masterInterference: number;
  scanlineStrength: number;
  baseNoise: number;
  scrollingNoise: number;
  horizontalDistortion: number;
  verticalDistortion: number;
  baseChromaticAberration: number;
  interferenceChromaticAberration: number;
  signalResolution: number;
  motionSpeed: number;
}

export type XccShaderSettingName = keyof XccShaderSettings;

export const XCC_SHADER_SETTING_NAMES = [
  "masterInterference",
  "scanlineStrength",
  "baseNoise",
  "scrollingNoise",
  "horizontalDistortion",
  "verticalDistortion",
  "baseChromaticAberration",
  "interferenceChromaticAberration",
  "signalResolution",
  "motionSpeed",
] as const satisfies readonly XccShaderSettingName[];

// These reproduce the supplied CC0 shader. Motion speed is an application-level
// multiplier, where 1 preserves the shader's original timing and 0 freezes it.
export const DEFAULT_XCC_SHADER_SETTINGS: Readonly<XccShaderSettings> =
  Object.freeze({
    masterInterference: 1,
    scanlineStrength: 0.2,
    baseNoise: 0.1,
    scrollingNoise: 0.8,
    horizontalDistortion: 0.02,
    verticalDistortion: 0.05,
    baseChromaticAberration: 0.005,
    interferenceChromaticAberration: 0.02,
    signalResolution: 256,
    motionSpeed: 1,
  });

export function createDefaultXccShaderSettings(): XccShaderSettings {
  return { ...DEFAULT_XCC_SHADER_SETTINGS };
}
