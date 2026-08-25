BEGIN;

UPDATE Lucky
SET Speed = 5
WHERE XCCName = 'Chased by Faunus'
  AND Speed = 1;

COMMIT;
