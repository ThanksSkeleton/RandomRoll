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

  // Inherited compatibility slots will map as follows when XCC generation is
  // implemented: equipment = adventurer pack, equipment2 = blank, and
  // equipment3 = occupation trade good.

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

  ...buildBlankDccCoreCharacter(),

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
