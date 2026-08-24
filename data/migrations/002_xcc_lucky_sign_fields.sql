BEGIN;

ALTER TABLE Lucky ADD COLUMN XCCWhen TEXT NOT NULL DEFAULT '';
ALTER TABLE Lucky ADD COLUMN XCCGod TEXT NOT NULL DEFAULT '';

UPDATE Lucky
SET
  XCCWhen = substr(XCCName, 1, instr(XCCName, ' - ') - 1),
  XCCGod = CASE
    WHEN instr(XCCName, ' by ') > 0
      THEN substr(XCCName, instr(XCCName, ' by ') + length(' by '))
    WHEN instr(XCCName, ' of ') > 0
      THEN substr(XCCName, instr(XCCName, ' of ') + length(' of '))
    ELSE ''
  END,
  XCCName = substr(XCCName, instr(XCCName, ' - ') + length(' - '))
WHERE inXCC = 'true';

UPDATE Lucky
SET XCCGod = 'The ' || substr(XCCGod, length('the ') + 1)
WHERE XCCGod LIKE 'the %';

COMMIT;
