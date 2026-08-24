import { autoflatten, type ExportFormat } from "../../framework";

/**
 * The flat, export-friendly data contract for a level-0 XCC character.
 *
 * Values remain blank until the XCC generation rules are implemented. Numeric
 * values use null so that zero remains available as a meaningful game value.
 */
export type XccCharacter = {
  // Identity and background
  firstName: string;
  lastName: string;
  gender: string;
  occupation: string;
  alignment: string;

  // Ancestry
  race: string;
  racialTraits: string;
  languages: string;

  // Core abilities
  strengthScore: number | null;
  strengthMod: number | null;
  agilityScore: number | null;
  agilityMod: number | null;
  staminaScore: number | null;
  staminaMod: number | null;
  personalityScore: number | null;
  personalityMod: number | null;
  intelligenceScore: number | null;
  intelligenceMod: number | null;
  luckScore: number | null;
  luckMod: number | null;

  // Combat and defenses
  armorClass: number | null;
  hitPoints: number | null;
  speed: number | null;
  initiative: number | null;
  saveReflex: number | null;
  saveFortitude: number | null;
  saveWillpower: number | null;

  // Weapon
  weaponName: string;
  weaponDamage: string;
  weaponType: string;
  weaponRange: string;
  weaponSpecialProperties: string;
  attackModifier: number | null;
  damageModifier: number | null;

  // Armor and equipment
  adventurerPack: string;
  armor: string;
  equipment: string;

  // Lucky sign
  luckySignName: string;
  luckySignEffect: string;

  // Xcrawl
  mojo: number;
  fame: number;
  wealth: number;

  // Presentation metadata
  portraitImagePath: string;
  portraitActorName: string;
};

const BLANK_XCC_CHARACTER: XccCharacter = {
  firstName: "",
  lastName: "",
  gender: "",
  occupation: "",
  alignment: "",

  race: "",
  racialTraits: "",
  languages: "",

  strengthScore: null,
  strengthMod: null,
  agilityScore: null,
  agilityMod: null,
  staminaScore: null,
  staminaMod: null,
  personalityScore: null,
  personalityMod: null,
  intelligenceScore: null,
  intelligenceMod: null,
  luckScore: null,
  luckMod: null,

  armorClass: null,
  hitPoints: null,
  speed: null,
  initiative: null,
  saveReflex: null,
  saveFortitude: null,
  saveWillpower: null,

  weaponName: "",
  weaponDamage: "",
  weaponType: "",
  weaponRange: "",
  weaponSpecialProperties: "",
  attackModifier: null,
  damageModifier: null,

  adventurerPack: "",
  armor: "",
  equipment: "",

  luckySignName: "",
  luckySignEffect: "",

  mojo: 0,
  fame: 0,
  wealth: 11,

  portraitImagePath: "",
  portraitActorName: "",
};

export function buildBlankXccCharacter(): XccCharacter {
  return { ...BLANK_XCC_CHARACTER };
}

export function default_build(seed: string): ExportFormat<XccCharacter> {
  return autoflatten("XCC Characters", seed, [buildBlankXccCharacter()]);
}
