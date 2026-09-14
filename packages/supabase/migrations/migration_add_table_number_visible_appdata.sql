-- Migration: Seed AppData flag controlling whether the table number is shown
-- on the order views (open orders, ready-for-pickup). Independent of
-- 'table_number_selectable', which only controls the customer-facing picker.
-- Defaults to enabled ('true').

INSERT INTO "AppData" (key, value, description)
SELECT
  'table_number_visible',
  'true',
  'Ob die Tischnummer in den Bestellansichten (Offene Bestellungen, Abholbereit) angezeigt wird'
WHERE NOT EXISTS (
  SELECT 1 FROM "AppData" WHERE key = 'table_number_visible'
);
