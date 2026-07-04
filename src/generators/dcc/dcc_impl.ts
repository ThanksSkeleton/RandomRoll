import seedrandom from "seedrandom";
import { autoflatten, random_multi, type ExportFormat } from "../../framework";
import { full_name } from "../../names_framework";

import { luckyRowToNice, type LuckyNice, type LuckyRow } from "../../table_data/Lucky";
import rawLucky from "../../table_data/Lucky.json";
const lucky : LuckyRow[] = rawLucky;
const luckyNice = lucky.map(luckyRowToNice)

import { type ItemsNice, type ItemsRow, toItemsNice } from "../../table_data/Items";
import rawItems from "../../table_data/Items.json";
const items : ItemsRow[] = rawItems;
const itemsNice = items.map(toItemsNice);

import { type ProfessionsRow } from "../../table_data/Professions";
import rawProfessions from "../../table_data/Professions.json";
const professions : ProfessionsRow[] = rawProfessions;

import { toWeaponsNice, type WeaponsNice, type WeaponsRow } from "../../table_data/Weapons";
import rawWeapons from "../../table_data/Weapons.json";
const weapons : WeaponsRow[] = rawWeapons;
const weaponsNice = weapons.map(toWeaponsNice);

export type StudentCharacter = {
  firstName: string;
  lastName: string;

  // Profession
  professionTitle: string;

  // Core Stats + Mods
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

  // Attacks and Defenses
  armorClass: number;  
  hitPoints: number;
  speed: number;
  initiative: number;
  saveReflex: number;
  saveFort: number;
  saveWill: number;

  // Weapon
  weaponDisplay: string;
  weaponUnderlying: string;
  weaponDamageBase: string;
  weaponType: string;

  attackMod: number;
  attackDamageMod: number;

  // Other Equipment
  equipment: string;
  equipment2: string;
  equipment3: string;
  startingFunds: number;

  // Lucky Sign
  luckySignName: string;
  luckySignDescription: string;

  // Other Stuff
  languages: string;
  fantasyTraits: string;
  fantasyRace: string;

  // Student Stuff
  studentStyle: string;
  gender: string;
  gpa: string;
  age: number;

  bag: string;

  lunchContainer: string;
  lunchMain: string;
  lunchSide1: string;
  lunchSide2: string;
  lunchDrink: string;

  portraitImagePath: string;
  luckysignImagePath: string;
  schoolLogoImagePath: string;

  studentId: string;
  dob_string: string;
  expiry_string: string;
};  

const MALE_FEMALE = ["Male", "Female"];

const US_STYLE = "US";

const DEFAULT_SCHOOL = "St. Cuthbert's Prepatory Academy";

const DEFAULT_PORTRAIT = "Default Portrait";

const DEFAULT_LUCKYSIGN_IMAGE = "DEFAULT"

const DEFAULT_AGE = 18;



export function default_build(seed: string): ExportFormat<StudentCharacter> 
{
    let rng : seedrandom.PRNG = seedrandom(seed);
    let to_return : StudentCharacter[] = [];
    for (let i = 0; i < 4; i++) 
    {
        to_return.push(build_dcc_student(rng, US_STYLE));
    }
    return autoflatten("Student DCC Characters", seed, to_return);
}




function build_dcc_student(rng: seedrandom.PRNG, nationality: string): StudentCharacter 
{
    // randomly rolled and mods

    let gender = male_female(rng);
    let name = full_name(rng, gender, nationality);
    let profession = profession_info(rng, gender);

    let str = roll_3_d_6(rng);
    let str_mod = ability_mod(str);
    let agi = roll_3_d_6(rng);
    let agi_mod = ability_mod(agi);
    let con = roll_3_d_6(rng);
    let con_mod = ability_mod(con);
    let per = roll_3_d_6(rng);
    let per_mod = ability_mod(per);
    let int = roll_3_d_6(rng);
    let int_mod = ability_mod(int);
    let luck = roll_3_d_6(rng);
    let luck_mod = ability_mod(luck);

    let luckySign = lucky_sign(rng);

    let hit_points_base = roll_1_d_4(rng);

    let gpa = Math.min(.25 * int, 4.0);

    // dependents

    let ac = 10 + agi_mod + luckySign.AC * luck_mod
    let hitPoints = hit_points_base + con_mod + luckySign.HP * luck_mod;
    let speed = 30 + luckySign.Speed * luck_mod;
    let initiative = agi_mod + luckySign.Init * luck_mod;
    let saveReflex = agi_mod + luckySign.Reflex_Save * luck_mod;
    let saveFort = con_mod + luckySign.Fortitude_Save * luck_mod;
    let saveWill = per_mod + luckySign.Will_Save * luck_mod;
    
    let weaponDisplay = profession.weapon.Weapon;
    let weaponUnderlying = profession.weapon.WeaponUnderlying;
    let attackDamageBase = profession.weapon.WeaponDamageBase;
    let weaponType = profession.weapon.WeaponType;
    let attackMod = weaponType == MELEE ? str_mod + luckySign.Melee_Attack * luck_mod : agi_mod + luckySign.Ranged_Attack * luck_mod;
    let attackDamageMod = weaponType == MELEE ? str_mod + luckySign.Melee_Damage * luck_mod : agi_mod + luckySign.Ranged_Damage * luck_mod;

    let luckySignName = luckySign.Tarot;
    let luckySignDescription = luckySign.Description;

    let bag = profession.bag.Item;

    let equipment1 = profession.tool.Item;
    let equipment2 = profession.cultural_item.Item;
    let equipment3 = profession.tradeGood.Item;

    let languages_string = "English";
    let fantasyRace = "Human";
    let fantasyTraits = "";
    let startingFunds = 0;

    let age = DEFAULT_AGE;

    let student_id = 100 + rng() * 200;
    let expiry_string = randomDateInYear(rng, 1987);
    let dob_string = randomDateInYear(rng, 1987-age);


   let char : StudentCharacter =  {

        firstName: name[0],
        lastName: name[1],

        // Profession
        professionTitle: profession.professionTitle.ProfessionTitle,

        // Core Stats + Mods
        strengthScore: str,
        strengthMod: str_mod,
        agilityScore: agi,
        agilityMod: agi_mod,
        staminaScore: con,
        staminaMod: con_mod,
        personalityScore: per,
        personalityMod: per_mod,
        intelligenceScore: int,
        intelligenceMod: int_mod,
        luckScore: luck,
        luckMod: luck_mod,

        // Attacks and Defenses
        armorClass: ac,
        hitPoints,
        speed,
        initiative,
        saveReflex,
        saveFort,
        saveWill,

        // Weapon
        weaponDisplay,
        weaponUnderlying,
        weaponDamageBase: attackDamageBase,
        weaponType,

        attackMod,
        attackDamageMod,

        // Other Equipment
        equipment: equipment1,
        equipment2,
        equipment3,
        startingFunds,

        // Lucky Sign
        luckySignName,
        luckySignDescription,

        // Other Stuff
        languages: languages_string,
        fantasyTraits,
        fantasyRace,


        studentStyle: US_STYLE,
        portraitImagePath: DEFAULT_PORTRAIT,  
        schoolLogoImagePath: DEFAULT_SCHOOL,
        luckysignImagePath: DEFAULT_LUCKYSIGN_IMAGE,

        gpa : gpa.toFixed(1),
        age: age,
        gender: gender,

        bag: bag,
        lunchContainer: profession.lunchContainer,
        lunchMain: profession.lunchMain,
        lunchSide1: profession.lunchSide1,
        lunchSide2: profession.lunchSide2,
        lunchDrink: profession.lunchDrink,

        studentId: student_id.toFixed(0),
        dob_string,
        expiry_string
    };

    return char;

}

function male_female(rng: seedrandom.PRNG): string 
{
    let index = Math.floor(rng()* MALE_FEMALE.length);
    return MALE_FEMALE[index];
}

function roll_3_d_6(rng: seedrandom.PRNG) : number 
{
    let a = Math.floor(rng()* 6) + 1;
    let b = Math.floor(rng()* 6) + 1;
    let c = Math.floor(rng()* 6) + 1;
    return a+b+c;
}

function ability_mod(score : number): number
{
  if (score === 3) return -3;
  if (score <= 5) return -2;
  if (score <= 7) return -1;
  if (score <= 12) return 0;
  if (score <= 15) return 1;
  if (score <= 17) return 2;
  return 3;
}

function roll_1_d_4(rng: seedrandom.PRNG) : number 
{
    return Math.floor(rng()* 4) + 1;
}

const MELEE = "Melee";
//const RANGED = "Ranged";

type ProfessionInfo = {
  professionTitle: ProfessionsRow;
  weapon: WeaponsNice;
  bag: ItemsNice;
  wallet_item: ItemsNice;
  tradeGood: ItemsNice;
  tool: ItemsNice;
  cultural_item: ItemsNice;
  
  lunchContainer: string;
  lunchMain: string;
  lunchSide1: string;
  lunchSide2: string;
  lunchDrink: string;
};

// FROM TABLE
function profession_info(rng: seedrandom.PRNG, gender: string): ProfessionInfo {
  const gender_professions = professions.filter(
    p => p.Genderlock == "" || p.Genderlock == gender
  );

  const profession = random_multi(rng, gender_professions);

  const weapon: WeaponsNice =
    profession.Weapon != ""
      ? weaponsNice.filter(w => w.Weapon == profession.Weapon)[0]
      : random_multi(
          rng,
          weaponsNice.filter(
            w => w.Random && (w.Genderlock == "" || w.Genderlock == gender)
          )
        );

  const trade_good = itemsNice.filter(i => i.Item == profession.TradeGood)[0];
  if (trade_good == null) {
    throw Error(`Trade Good ${profession.TradeGood} not found`);
  }

  const rollable_items = itemsNice
    .filter(i => i.Random)
    .filter(i => i.Genderlock == "" || i.Genderlock == gender)
    .filter(i => i.Item != trade_good.Item);

  const tool_item = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "Tool")
  );

  const wallet_item = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "Wallet")
  );

  const bag_item = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "Bag")
  );

  const food_bag = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "FoodContainer")
  );

  const food_main = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "FoodMain")
  );

  const food_side_1 = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "FoodSide")
  );

  const food_side_2 = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "FoodSide")
  );

  const food_drink = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "FoodDrink")
  );

  const cultural_item = random_multi(
    rng,
    rollable_items.filter(i => i.Category == "Cultural Goods")
  );
  

  return {
    professionTitle: profession,
    weapon,
    bag: bag_item,
    wallet_item,
    tradeGood: trade_good,
    tool: tool_item,
    cultural_item,
    lunchContainer: food_bag.Item,
    lunchMain: food_main.Item,
    lunchSide1: food_side_1.Item,
    lunchSide2: food_side_2.Item,
    lunchDrink: food_drink.Item,
  };
}

// FROM TABLE
function lucky_sign(rng:seedrandom.PRNG) : LuckyNice 
{
    return random_multi(rng, luckyNice);
}

function randomDateInYear(rng: seedrandom.PRNG, year: number): string {
  const start = Date.UTC(year, 0, 1);  // Jan 1, 1987
  const end = Date.UTC(year+1, 0, 1);    // Jan 1, 1988, exclusive

  const timestamp = start + Math.floor(rng() * (end - start));

  let date = new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  }).format(date);
}