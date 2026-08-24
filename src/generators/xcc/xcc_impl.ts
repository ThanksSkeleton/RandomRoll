import seedrandom from "seedrandom";
import { autoflatten, random_multi, type ExportFormat } from "../../framework";
import { full_name } from "../../names_framework";
import { type ItemsNice, type ItemsRow, toItemsNice } from "../../table_data/Items";
import rawItems from "../../table_data/Items.json";
import { luckyRowToNice, type LuckyNice, type LuckyRow } from "../../table_data/Lucky";
import rawLucky from "../../table_data/Lucky.json";
import rawRaceNotes from "../../table_data/RaceNotes.json";
import rawArmor from "../../table_data/XCC_Armor.json";
import rawPacks from "../../table_data/Starting_Adventurer_Packs.json";
import {
  toWeaponsNice,
  type WeaponsNice,
  type WeaponsRow,
} from "../../table_data/Weapons";
import rawWeapons from "../../table_data/Weapons.json";
import type { XccCelebrityHeadshotsRow } from "../../table_data/xcc_celebrity_headshots";
import rawHeadshots from "../../table_data/xcc_celebrity_headshots.json";
import {
  toXccOccupation,
  type XccOccupation,
  type XccOccupationsRow,
} from "../../table_data/xcc_occupations";
import rawOccupations from "../../table_data/xcc_occupations.json";
import {
  buildBlankDccCoreCharacter,
  buildDccCoreCharacter,
  type BlankDccCoreCharacter,
  type DccCoreCharacter,
  type DccCoreLuckySign,
  type DccCoreWeapon,
} from "../dcc_core/dcc_core";

type RaceNote = {
  racialTraits: string;
  racialLanguage: string;
  baseSpeed: number;
};

type Armor = {
  acBonus: number;
  checkPenalty: number;
  speedPenalty: number;
  fumbleDie: number;
  cost: string;
};

type AdventurerPack = {
  weaponOfChoice: boolean;
  includedWeapon: string;
  armor: string;
  otherEquipment: string[];
};

const raceNotes = rawRaceNotes as Record<string, RaceNote>;
const armorByName = rawArmor as Record<string, Armor>;
const packsByName = rawPacks as Record<string, AdventurerPack>;

const occupations = (rawOccupations as XccOccupationsRow[]).map(toXccOccupation);
const headshots = rawHeadshots as XccCelebrityHeadshotsRow[];
const xccItems: ItemsNice[] = (rawItems as ItemsRow[])
  .map(toItemsNice)
  .filter(item => item.Source === "XCC" && item.Random);
const xccWeapons: WeaponsNice[] = (rawWeapons as WeaponsRow[])
  .map(toWeaponsNice)
  .filter(weapon => weapon.Source === "XCC");
const xccLuckySigns: LuckyNice[] = (rawLucky as LuckyRow[])
  .map(luckyRowToNice)
  .filter(sign => sign.inXCC);

const GENDERS = ["Male", "Female"] as const;
const ALIGNMENTS = ["Lawful", "Neutral", "Chaotic"] as const;
const NAME_GROUP = "US";
const BASE_ARMOR_CLASS = 10;
const DEFAULT_MOJO = 0;
const DEFAULT_FAME = 0;
const DEFAULT_WEALTH = 11;
const EXTRA_GEAR = "extra piece of gear";

const UNARMED_WEAPON: DccCoreWeapon = {
  displayName: "Unarmed",
  underlyingName: "Unarmed",
  damageBase: "1d3",
  weaponType: "Melee",
  range: "0",
  specialProperties: "",
};

export type XccCharacter = DccCoreCharacter & {
  firstName: string;
  lastName: string;
  mojo: number;
  fame: number;
  wealth: number;
  packContents: string;
  portraitImagePath: string;
  portraitActorName: string;
};

export type BlankXccCharacter = BlankDccCoreCharacter & {
  firstName: string;
  lastName: string;
  mojo: number;
  fame: number;
  wealth: number;
  packContents: string;
  portraitImagePath: string;
  portraitActorName: string;
};

const BLANK_XCC_CHARACTER: BlankXccCharacter = {
  firstName: "",
  lastName: "",
  ...buildBlankDccCoreCharacter(),
  mojo: DEFAULT_MOJO,
  fame: DEFAULT_FAME,
  wealth: DEFAULT_WEALTH,
  packContents: "",
  portraitImagePath: "",
  portraitActorName: "",
};

export function buildBlankXccCharacter(): BlankXccCharacter {
  return { ...BLANK_XCC_CHARACTER };
}

export function default_build(seed: string): ExportFormat<XccCharacter> {
  const rng = seedrandom(seed);
  return autoflatten("XCC Characters", seed, [buildXccCharacter(rng)]);
}

export function buildXccCharacter(rng: seedrandom.PRNG): XccCharacter {
  const gender = random_multi(rng, [...GENDERS]);
  const [firstName, lastName] = full_name(rng, gender, NAME_GROUP);
  const occupation = random_multi(rng, occupations);
  const race = requireMapping(raceNotes, occupation.Race, "race notes");
  const pack = occupation.AdventurePack === ""
    ? undefined
    : requireMapping(packsByName, occupation.AdventurePack, "adventurer pack");
  const armor = requireMapping(
    armorByName,
    pack?.armor ?? "Unarmored",
    "armor",
  );
  const hasShield = pack?.otherEquipment.includes("Shield") ?? false;
  const shield = hasShield
    ? requireMapping(armorByName, "Shield", "armor")
    : undefined;
  const weapon = chooseWeapon(rng, pack);
  const alignment = random_multi(rng, [...ALIGNMENTS]);
  const portrait = random_multi(
    rng,
    headshots.filter(candidate => candidate.GENDER === gender),
  );
  const tradeGood = resolveTradeGood(rng, occupation);
  const packContents = pack?.otherEquipment.join(", ") ?? "";
  const displayedArmor = hasShield
    ? `${pack?.armor} + Shield`
    : pack?.armor ?? "Unarmored";

  const core = buildDccCoreCharacter(rng, {
    professionTitle: occupation.Title,
    gender,
    race: occupation.Race,
    racialTraits: race.racialTraits,
    languages: race.racialLanguage,
    alignment,
    armorName: displayedArmor,
    armorAC: BASE_ARMOR_CLASS + armor.acBonus + (shield?.acBonus ?? 0),
    equipment: occupation.AdventurePack,
    equipment2: "",
    equipment3: tradeGood,
    startingFunds: occupation.StartingFunds,
    weapon,
    rollLuckySign: rollXccLuckySign,
    baseSpeed:
      race.baseSpeed
      - armor.speedPenalty
      - (shield?.speedPenalty ?? 0),
  });

  return {
    firstName,
    lastName,
    ...core,
    languages: formatLanguages(race.racialLanguage, core.intelligenceMod),
    mojo: DEFAULT_MOJO,
    fame: DEFAULT_FAME,
    wealth: DEFAULT_WEALTH,
    packContents,
    portraitImagePath: portrait.HEADSHOT_URL,
    portraitActorName: portrait.NAME,
  };
}

function chooseWeapon(
  rng: seedrandom.PRNG,
  pack: AdventurerPack | undefined,
): DccCoreWeapon {
  if (!pack) {
    return UNARMED_WEAPON;
  }

  const weapon = pack.weaponOfChoice
    ? random_multi(rng, xccWeapons.filter(candidate => candidate.RandomPool))
    : xccWeapons.find(candidate => candidate.Weapon === pack.includedWeapon);

  if (!weapon) {
    throw new Error(`No XCC weapon is configured for pack weapon "${pack.includedWeapon}".`);
  }

  return {
    displayName: weapon.Weapon,
    underlyingName: weapon.WeaponUnderlying,
    damageBase: weapon.WeaponDamageBase,
    weaponType: weapon.WeaponType,
    range: weapon.Range,
    specialProperties: weapon.CommaSeparatedSpecialProperties,
  };
}

function rollXccLuckySign(rng: seedrandom.PRNG): DccCoreLuckySign {
  const sign = random_multi(rng, xccLuckySigns);

  return {
    name: sign.XCCName,
    description: sign.Description,
    meleeAttack: sign.Melee_Attack,
    rangedAttack: sign.Ranged_Attack,
    meleeDamage: sign.Melee_Damage,
    rangedDamage: sign.Ranged_Damage,
    fortitudeSave: sign.Fortitude_Save,
    reflexSave: sign.Reflex_Save,
    willSave: sign.Will_Save,
    armorClass: sign.AC,
    initiative: sign.Init,
    hitPoints: sign.HP,
    speed: sign.Speed,
  };
}

function resolveTradeGood(
  rng: seedrandom.PRNG,
  occupation: XccOccupation,
): string {
  if (occupation.TradeGood.toLowerCase() !== EXTRA_GEAR) {
    return occupation.TradeGood;
  }

  return random_multi(rng, xccItems).Item;
}

function formatLanguages(racialLanguage: string, intelligenceMod: number): string {
  const knownLanguages = racialLanguage === "English"
    ? "English"
    : `English, ${racialLanguage}`;

  if (intelligenceMod <= 0) {
    return knownLanguages;
  }

  const suffix = intelligenceMod === 1 ? "language" : "languages";
  return `${knownLanguages}, ${intelligenceMod} additional ${suffix}`;
}

function requireMapping<TValue>(
  mapping: Record<string, TValue>,
  key: string,
  label: string,
): TValue {
  const value = mapping[key];

  if (!value) {
    throw new Error(`Missing ${label} mapping for "${key}".`);
  }

  return value;
}
