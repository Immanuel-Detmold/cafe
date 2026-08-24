-- Migration: Seed AppData key controlling how many tables the cafe has.
-- Drives the table-number pickers (NewOrder, public menu cart) and the
-- QR-code sheet, replacing the previous hardcoded 30. Defaults to '30'.

INSERT INTO "AppData" (key, value, description)
SELECT
  'table_count',
  '30',
  'Anzahl der Tische im Café (steuert Tischnummer-Auswahl und QR-Code-Bogen)'
WHERE NOT EXISTS (
  SELECT 1 FROM "AppData" WHERE key = 'table_count'
);
