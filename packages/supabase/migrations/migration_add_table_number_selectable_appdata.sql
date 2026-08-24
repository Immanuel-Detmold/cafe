-- Migration: Seed AppData flag controlling whether customers can select a
-- table number on the public menu card. Defaults to enabled ('true').

INSERT INTO "AppData" (key, value, description)
SELECT
  'table_number_selectable',
  'true',
  'Ob die Tischnummer-Auswahl im Warenkorb der Menükarte für Kunden sichtbar ist'
WHERE NOT EXISTS (
  SELECT 1 FROM "AppData" WHERE key = 'table_number_selectable'
);
