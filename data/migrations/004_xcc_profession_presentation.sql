BEGIN;

ALTER TABLE Professions
  ADD COLUMN XCCPresentation TEXT NOT NULL DEFAULT '';

UPDATE Professions
SET XCCPresentation = ProfessionTitle;

UPDATE Professions
SET XCCPresentation = CASE ProfessionTitle
  WHEN 'Bank teller' THEN 'Bank Teller'
  WHEN 'Body mod artist' THEN 'Body Mod Artist'
  WHEN 'Bus Driver' THEN 'Bus Driver'
  WHEN 'Cab Driver' THEN 'Cab Driver'
  WHEN 'Cafeteria worker' THEN 'Cafeteria Worker'
  WHEN 'Call center rep' THEN 'Call Center Rep'
  WHEN 'Cashier-grocery' THEN 'Cashier (Grocery)'
  WHEN 'Clerk-bookstore' THEN 'Clerk (Bookstore)'
  WHEN 'Clerk-retail' THEN 'Clerk (Retail)'
  WHEN 'College campus security' THEN 'College Campus Security'
  WHEN 'College library assistant' THEN 'College Library Assistant'
  WHEN 'College resident advisor' THEN 'College Resident Advisor'
  WHEN 'College scholarship athlete' THEN 'College Scholarship Athlete'
  WHEN 'College scholarship student' THEN 'College Scholarship Student'
  WHEN 'College student' THEN 'College Student'
  WHEN 'College teaching assistant' THEN 'College Teaching Assistant'
  WHEN 'Contractor-carpenter' THEN 'Carpenter'
  WHEN 'Contractor-painter' THEN 'Painter'
  WHEN 'Contractor-roofer' THEN 'Roofer'
  WHEN 'Delivery person' THEN 'Delivery Person'
  WHEN 'Dwarf-miner' THEN 'Miner'
  WHEN 'Dwarf-stonemason' THEN 'Stonemason'
  WHEN 'Elf-ne''er-do-well' THEN 'Ne''er-do-well'
  WHEN 'Equestrian trainer' THEN 'Equestrian Trainer'
  WHEN 'Factory worker' THEN 'Factory Worker'
  WHEN 'Farmer-arable' THEN 'Farmer (Arable)'
  WHEN 'Farmer-dairy' THEN 'Farmer (Dairy)'
  WHEN 'Farmer-organic' THEN 'Farmer (Organic)'
  WHEN 'Farmer-pastoral' THEN 'Farmer (Pastoral)'
  WHEN 'Farmer-poultry' THEN 'Farmer (Poultry)'
  WHEN 'Farmer-sustenance' THEN 'Farmer (Sustenance)'
  WHEN 'Fast food employee' THEN 'Fast Food Employee'
  WHEN 'Fitness instructor' THEN 'Fitness Instructor'
  WHEN 'Flight attendant' THEN 'Flight Attendant'
  WHEN 'Gnome-crafter' THEN 'Crafter'
  WHEN 'Gnome-entertainer' THEN 'Entertainer'
  WHEN 'Gnome-tailor' THEN 'Tailor'
  WHEN 'Half-elf-adventurer' THEN 'Adventurer'
  WHEN 'Half-elf-wayfarer' THEN 'Wayfarer'
  WHEN 'Half-orc-crawler' THEN 'Crawler'
  WHEN 'Half-orc-language teacher' THEN 'Language Teacher'
  WHEN 'Halfling-cook' THEN 'Cook'
  WHEN 'Halfling-gardener' THEN 'Gardener'
  WHEN 'Hotel employee' THEN 'Hotel Employee'
  WHEN 'House staff' THEN 'House Staff'
  WHEN 'Law clerk' THEN 'Law Clerk'
  WHEN 'Line cook' THEN 'Line Cook'
  WHEN 'Luggage handler' THEN 'Luggage Handler'
  WHEN 'Marketing assistant' THEN 'Marketing Assistant'
  WHEN 'Odd job person' THEN 'Temporary Temp'
  WHEN 'Office assistant' THEN 'Office Assistant'
  WHEN 'Office worker-temp' THEN 'Temp'
  WHEN 'Parking valet' THEN 'Parking Valet'
  WHEN 'Postal worker' THEN 'Postal Worker'
  WHEN 'Rail conductor' THEN 'Rail Conductor'
  WHEN 'Ranch hand' THEN 'Ranch Hand'
  WHEN 'Security guard' THEN 'Security Guard'
  WHEN 'Substitute teacher' THEN 'Substitute Teacher'
  WHEN 'Truck driver' THEN 'Truck Driver'
  WHEN 'Veterinary assistant' THEN 'Veterinary Assistant'
  WHEN 'Warehouse worker' THEN 'Warehouse Worker'
  WHEN 'Wizard''s assistant' THEN 'Wizard''s Assistant'
  ELSE XCCPresentation
END
WHERE Source = 'XCC';

COMMIT;
