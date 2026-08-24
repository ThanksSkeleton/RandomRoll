import type seedrandom from "seedrandom";

export type DccCoreWeapon = {
  displayName: string;
  underlyingName: string;
  damageBase: string;
  weaponType: string;
};

export type DccCoreLuckySign = {
  name: string;
  description: string;
  meleeAttack: number;
  rangedAttack: number;
  meleeDamage: number;
  rangedDamage: number;
  fortitudeSave: number;
  reflexSave: number;
  willSave: number;
  armorClass: number;
  initiative: number;
  hitPoints: number;
  speed: number;
};

export type DccCoreCharacter = {
  strengthScore: number;
  strengthMod: number;
  agilityScore: number;
  agilityMod: number;
  staminaScore: number;
  staminaMod: number;
  personalityScore: number;
  personalityMod: number;
  intelligenceScore: number;
  intelligenceMod: number;
  luckScore: number;
  luckMod: number;

  armorClass: number;
  hitPoints: number;
  speed: number;
  initiative: number;
  saveReflex: number;
  saveFort: number;
  saveWill: number;

  weaponDisplay: string;
  weaponUnderlying: string;
  weaponDamageBase: string;
  weaponType: string;
  attackMod: number;
  attackDamageMod: number;

  luckySignName: string;
  luckySignDescription: string;
};

export type BlankDccCoreCharacter = {
  [K in keyof DccCoreCharacter]: DccCoreCharacter[K] extends number
    ? number | null
    : DccCoreCharacter[K];
};

export type BuildDccCoreCharacterOptions = {
  weapon: DccCoreWeapon;
  rollLuckySign: (rng: seedrandom.PRNG) => DccCoreLuckySign;
  baseSpeed?: number;
};

const MELEE = "Melee";

export function buildDccCoreCharacter(
  rng: seedrandom.PRNG,
  options: BuildDccCoreCharacterOptions,
): DccCoreCharacter {
  const strengthScore = roll3d6(rng);
  const strengthMod = abilityModifier(strengthScore);
  const agilityScore = roll3d6(rng);
  const agilityMod = abilityModifier(agilityScore);
  const staminaScore = roll3d6(rng);
  const staminaMod = abilityModifier(staminaScore);
  const personalityScore = roll3d6(rng);
  const personalityMod = abilityModifier(personalityScore);
  const intelligenceScore = roll3d6(rng);
  const intelligenceMod = abilityModifier(intelligenceScore);
  const luckScore = roll3d6(rng);
  const luckMod = abilityModifier(luckScore);

  // Consumers choose the compatible lucky-sign table. Keeping this roll after
  // the abilities preserves the established DCC student seed sequence.
  const luckySign = options.rollLuckySign(rng);
  const baseHitPoints = rollDie(rng, 4);
  const baseSpeed = options.baseSpeed ?? 30;
  const isMelee = options.weapon.weaponType === MELEE;

  return {
    strengthScore,
    strengthMod,
    agilityScore,
    agilityMod,
    staminaScore,
    staminaMod,
    personalityScore,
    personalityMod,
    intelligenceScore,
    intelligenceMod,
    luckScore,
    luckMod,

    armorClass: 10 + agilityMod + luckySign.armorClass * luckMod,
    hitPoints: Math.max(
      baseHitPoints + staminaMod + luckySign.hitPoints * luckMod,
      1,
    ),
    speed: baseSpeed + luckySign.speed * luckMod,
    initiative: agilityMod + luckySign.initiative * luckMod,
    saveReflex: agilityMod + luckySign.reflexSave * luckMod,
    saveFort: staminaMod + luckySign.fortitudeSave * luckMod,
    saveWill: personalityMod + luckySign.willSave * luckMod,

    weaponDisplay: options.weapon.displayName,
    weaponUnderlying: options.weapon.underlyingName,
    weaponDamageBase: options.weapon.damageBase,
    weaponType: options.weapon.weaponType,
    attackMod:
      (isMelee ? strengthMod : agilityMod)
      + (isMelee ? luckySign.meleeAttack : luckySign.rangedAttack) * luckMod,
    attackDamageMod:
      (isMelee ? strengthMod : agilityMod)
      + (isMelee ? luckySign.meleeDamage : luckySign.rangedDamage) * luckMod,

    luckySignName: luckySign.name,
    luckySignDescription: luckySign.description,
  };
}

export function buildBlankDccCoreCharacter(): BlankDccCoreCharacter {
  return {
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
    saveFort: null,
    saveWill: null,

    weaponDisplay: "",
    weaponUnderlying: "",
    weaponDamageBase: "",
    weaponType: "",
    attackMod: null,
    attackDamageMod: null,

    luckySignName: "",
    luckySignDescription: "",
  };
}

export function roll3d6(rng: seedrandom.PRNG): number {
  return rollDie(rng, 6) + rollDie(rng, 6) + rollDie(rng, 6);
}

export function rollDie(rng: seedrandom.PRNG, sides: number): number {
  if (!Number.isInteger(sides) || sides < 1) {
    throw new Error(`Die sides must be a positive integer; received ${sides}.`);
  }

  return Math.floor(rng() * sides) + 1;
}

export function abilityModifier(score: number): number {
  if (score === 3) return -3;
  if (score <= 5) return -2;
  if (score <= 7) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}
