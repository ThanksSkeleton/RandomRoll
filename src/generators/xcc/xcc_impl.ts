import { autoflatten, type ExportFormat } from "../../framework";
import {
  buildBlankDccCoreCharacter,
  type BlankDccCoreCharacter,
} from "../dcc_core/dcc_core";

/**
 * The flat, export-friendly data contract for a level-0 XCC character.
 *
 * Values remain blank until the XCC generation rules are implemented. Numeric
 * values use null so that zero remains available as a meaningful game value.
 */
export type XccCharacter = BlankDccCoreCharacter & {
  // Identity and background
  firstName: string;
  lastName: string;
  gender: string;
  professionTitle: string;
  alignment: string;

  // Ancestry
  race: string;
  racialTraits: string;
  languages: string;

  // XCC weapon details beyond the shared DCC core
  weaponRange: string;
  weaponSpecialProperties: string;

  // Armor and equipment
  adventurerPack: string;
  armor: string;
  equipment: string;

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
  professionTitle: "",
  alignment: "",

  race: "",
  racialTraits: "",
  languages: "",

  ...buildBlankDccCoreCharacter(),

  weaponRange: "",
  weaponSpecialProperties: "",

  adventurerPack: "",
  armor: "",
  equipment: "",

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
