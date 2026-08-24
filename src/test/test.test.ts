import { describe, expect, it } from "vitest";
import { build_super_export } from "../generators/supers/supers_impl";
import { default_build as buildDccStudents } from "../generators/dcc_students/dcc_students_impl";
import {
  abilityModifier,
  buildBlankDccCoreCharacter,
} from "../generators/dcc_core/dcc_core";
import { buildBlankXccCharacter } from "../generators/xcc/xcc_impl";

import { type ItemsNice, type ItemsRow, toItemsNice } from "../table_data/Items";
import rawItems from "../table_data/Items.json";

import { type ProfessionsRow } from "../table_data/Professions";
import rawProfessions from "../table_data/Professions.json";

import { toWeaponsNice, type WeaponsNice, type WeaponsRow } from "../table_data/Weapons";
import rawWeapons from "../table_data/Weapons.json";

import { luckyRowToNice, type LuckyRow } from "../table_data/Lucky";
import rawLucky from "../table_data/Lucky.json";

const items: ItemsRow[] = rawItems;
const itemsNice: ItemsNice[] = items.map(toItemsNice);

const professions: ProfessionsRow[] = rawProfessions;

const weapons: WeaponsRow[] = rawWeapons;
const weaponsNice: WeaponsNice[] = weapons.map(toWeaponsNice);

const lucky: LuckyRow[] = rawLucky;

function nonEmpty(value: string): boolean {
  return value.trim() !== "";
}

describe("DCC profession data integrity", () => {
  it("all weapons referenced by professions exist in weapons", () => {
    const weaponNames = new Set(weaponsNice.map((w) => w.Weapon));

    const missingWeapons = professions
      .map((p) => p.Weapon)
      .filter(nonEmpty)
      .filter((weapon) => !weaponNames.has(weapon));

    expect(missingWeapons).toEqual([]);
  });

  it("all profession trade goods exist in items", () => {
    const itemNames = new Set(itemsNice.map((i) => i.Item));

    const missingTradeGoods = professions
      .map((p) => p.TradeGood)
      .filter(nonEmpty)
      .filter((tradeGood) => !itemNames.has(tradeGood));

    expect(missingTradeGoods).toEqual([]);
  });

  it("all weapons not assigned to a specific profession are random", () => {
    const professionWeapons = new Set(
      professions
        .map((p) => p.Weapon)
        .filter(nonEmpty),
    );

    const nonRandomUnassignedWeapons = weaponsNice
      .filter((w) => w.Source === "USSTUDENTS")
      .filter((w) => !professionWeapons.has(w.Weapon))
      .filter((w) => !w.RandomPool)
      .map((w) => w.Weapon);

    expect(nonRandomUnassignedWeapons).toEqual([]);
  });

  it("all items not assigned to a specific profession are random", () => {
    const professionTradeGoods = new Set(
      professions
        .map((p) => p.TradeGood)
        .filter(nonEmpty),
    );

    const nonRandomUnassignedItems = itemsNice
      .filter((i) => !professionTradeGoods.has(i.Item))
      .filter((i) => !i.Random)
      .map((i) => i.Item);

    expect(nonRandomUnassignedItems).toEqual([]);
  });
});

describe("XCC weapon data integrity", () => {
  const xccWeapons = weaponsNice.filter((weapon) => weapon.Source === "XCC");

  it("contains the complete XCC weapon list", () => {
    expect(xccWeapons).toHaveLength(29);
  });

  it("uses only the five XCC default weapons in the random pool", () => {
    const randomPoolNames = xccWeapons
      .filter((weapon) => weapon.RandomPool)
      .map((weapon) => weapon.Weapon)
      .sort();

    expect(randomPoolNames).toEqual([
      "Club",
      "Dagger",
      "Rapier",
      "Sling",
      "Spear",
    ]);
  });

  it("stores range as zero or three slash-separated distances", () => {
    expect(
      xccWeapons.every((weapon) =>
        weapon.Range === "0" || /^\d+\/\d+\/\d+$/.test(weapon.Range)
      )
    ).toBe(true);
  });

  it("stores XCC damage in dice notation", () => {
    expect(
      xccWeapons.every((weapon) => /^1d\d+$/.test(weapon.WeaponDamageBase))
    ).toBe(true);
  });

  it("keeps dagger base damage separate from its backstab rule", () => {
    const dagger = xccWeapons.find((weapon) => weapon.Weapon === "Dagger");

    expect(dagger?.WeaponDamageBase).toBe("1d4");
    expect(dagger?.CommaSeparatedSpecialProperties).toBe("Backstab,Hurl");
  });
});

describe("Lucky sign variants", () => {
  it("retains the original 30 DCC lucky signs", () => {
    const dccSigns = lucky.map(luckyRowToNice).filter((sign) => sign.inDCC);

    expect(dccSigns).toHaveLength(30);
  });

  it("includes all 24 XCC lucky signs", () => {
    const xccSigns = lucky.map(luckyRowToNice).filter((sign) => sign.inXCC);

    expect(xccSigns).toHaveLength(24);
    expect(xccSigns.every((sign) => nonEmpty(sign.XCCName))).toBe(true);
  });
});

describe("DCC core", () => {
  it("uses the DCC ability modifier table", () => {
    expect([
      3, 4, 5, 6, 7, 8, 12, 13, 15, 16, 17, 18,
    ].map(abilityModifier)).toEqual([
      -3, -2, -2, -1, -1, 0, 0, 1, 1, 2, 2, 3,
    ]);
  });

  it("provides the common blank shape consumed by XCC", () => {
    expect(buildBlankXccCharacter()).toMatchObject(
      buildBlankDccCoreCharacter(),
    );
  });
});

describe("DCC student seed compatibility", () => {
  it("preserves the established student roll sequence", () => {
    const output = buildDccStudents("refactor-check");

    expect(output.objects.map(character => ({
      firstName: character.firstName,
      lastName: character.lastName,
      luckySignName: character.luckySignName,
      studentId: character.studentId,
      dob: character.dob_string,
      expiry: character.expiry_string,
    }))).toEqual([
      { firstName: "Karen", lastName: "Obrien", luckySignName: "The Lovers", studentId: "257", dob: "06/28/1969", expiry: "02/07/1987" },
      { firstName: "Iris", lastName: "Tanner", luckySignName: "The Hierophant", studentId: "253", dob: "03/19/1969", expiry: "03/16/1987" },
      { firstName: "Sergio", lastName: "Strong", luckySignName: "Temperance", studentId: "102", dob: "11/03/1969", expiry: "08/04/1987" },
      { firstName: "Lara", lastName: "Brennan", luckySignName: "Queen of Cups", studentId: "193", dob: "02/01/1969", expiry: "05/06/1987" },
    ]);
  });
});

describe("All UTs", () => {

  it("IATW Powers test", () => {
      let output = build_super_export("TEST", 200);
      console.debug(output);
      // expect(output[0][0]).toBe("Daichi");
      // expect(output[1][0]).toBe("Hiroshi");
      // expect(output[2][0]).toBe("Satoshi");
      // expect(output[0][1]).toBe("Mars");
      // expect(output[0][2]).toBe("grounded");
  });

  it("DCC Students test", () => {
      let output = buildDccStudents("TEST");
      console.debug(output);
      // expect(output[0][0]).toBe("Daichi");
      // expect(output[1][0]).toBe("Hiroshi");
      // expect(output[2][0]).toBe("Satoshi");
      // expect(output[0][1]).toBe("Mars");
      // expect(output[0][2]).toBe("grounded");
  });
});
