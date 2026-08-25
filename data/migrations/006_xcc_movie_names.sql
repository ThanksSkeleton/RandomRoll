BEGIN;

CREATE TABLE xcc_movie_names (
  TITLE TEXT PRIMARY KEY NOT NULL
);

INSERT INTO xcc_movie_names (TITLE) VALUES
  ('XCrawl 0: Origins'),
  ('XCrawl: Tyrant''s Tale'),
  ('XCrawl II: Roundhouse'),
  ('XCrawl III: The Revenge'),
  ('XCrawl IV: Orclord'),
  ('XCrawl X: Overclocked'),
  ('XCrawl 2K: Endgame'),
  ('XCrawl Legacy'),
  ('XCrawl Redux'),
  ('XCrawl: Cry Harder');

COMMIT;
