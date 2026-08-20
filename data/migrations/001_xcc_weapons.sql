BEGIN;

ALTER TABLE Weapons RENAME COLUMN Random TO RandomPool;
ALTER TABLE Weapons ADD COLUMN CommaSeparatedSpecialProperties TEXT NOT NULL DEFAULT '';
ALTER TABLE Weapons ADD COLUMN Range TEXT NOT NULL DEFAULT '0';

INSERT INTO Weapons (
  Weapon,
  WeaponType,
  WeaponUnderlying,
  WeaponDamageBase,
  Genderlock,
  RandomPool,
  Source,
  CommaSeparatedSpecialProperties,
  Range
) VALUES
  ('Battleaxe', 'Melee', 'Battleaxe', '1d10', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Club', 'Melee', 'Club', '1d4', '', 'TRUE', 'XCC', '', '0'),
  ('Crossbow', 'Ranged', 'Crossbow', '1d6', '', 'FALSE', 'XCC', 'Two-handed,Reload', '80/160/240'),
  ('Hand Crossbow', 'Ranged', 'Hand Crossbow', '1d4', '', 'FALSE', 'XCC', 'Reload', '20/40/60'),
  ('Crossbow, Repeating', 'Ranged', 'Crossbow, Repeating', '1d6', '', 'FALSE', 'XCC', 'Two-handed', '80/160/240'),
  ('Dagger', 'Ranged', 'Dagger', '1d4', '', 'TRUE', 'XCC', 'Backstab,Hurl', '10/20/30'),
  ('Flail', 'Melee', 'Flail', '1d6', '', 'FALSE', 'XCC', '', '0'),
  ('Javelin', 'Ranged', 'Javelin', '1d6', '', 'FALSE', 'XCC', 'Hurl', '30/60/90'),
  ('Handaxe', 'Ranged', 'Handaxe', '1d6', '', 'FALSE', 'XCC', 'Hurl', '10/20/30'),
  ('Lance', 'Melee', 'Lance', '1d12', '', 'FALSE', 'XCC', 'Mounted', '0'),
  ('Longbow', 'Ranged', 'Longbow', '1d6', '', 'FALSE', 'XCC', 'Two-handed', '70/140/210'),
  ('Longsword', 'Melee', 'Longsword', '1d8', '', 'FALSE', 'XCC', '', '0'),
  ('Mace', 'Melee', 'Mace', '1d6', '', 'FALSE', 'XCC', '', '0'),
  ('Nunchaku', 'Melee', 'Nunchaku', '1d5', '', 'FALSE', 'XCC', '', '0'),
  ('Polearm', 'Melee', 'Polearm', '1d10', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Pick, Military', 'Melee', 'Pick, Military', '1d10', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Quarterstaff', 'Melee', 'Quarterstaff', '1d4', '', 'FALSE', 'XCC', '', '0'),
  ('Rapier', 'Melee', 'Rapier', '1d5', '', 'TRUE', 'XCC', 'Agility', '0'),
  ('Scimitar', 'Melee', 'Scimitar', '1d6', '', 'FALSE', 'XCC', '', '0'),
  ('Shield', 'Melee', 'Shield', '1d3', '', 'FALSE', 'XCC', '', '0'),
  ('Sling', 'Ranged', 'Sling', '1d4', '', 'TRUE', 'XCC', '', '40/80/120'),
  ('Shortbow', 'Ranged', 'Shortbow', '1d6', '', 'FALSE', 'XCC', 'Two-handed', '50/100/150'),
  ('Short Sword', 'Melee', 'Short Sword', '1d6', '', 'FALSE', 'XCC', '', '0'),
  ('Spear', 'Melee', 'Spear', '1d8', '', 'TRUE', 'XCC', 'Two-handed', '0'),
  ('Stiletto', 'Ranged', 'Stiletto', '1d3', '', 'FALSE', 'XCC', 'Concealable', '10/15/20'),
  ('Scythe', 'Melee', 'Scythe', '1d10', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Trident', 'Melee', 'Trident', '1d8', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Two-Handed Sword', 'Melee', 'Two-Handed Sword', '1d10', '', 'FALSE', 'XCC', 'Two-handed', '0'),
  ('Warhammer', 'Melee', 'Warhammer', '1d8', '', 'FALSE', 'XCC', '', '0');

COMMIT;
