-- Migration: Auto-assign order_number via Postgres trigger
-- This replaces the client-side AppData-based order number logic AND the edge function calculation.
-- Single source of truth: order_number is always derived from today's actual orders.

-- 1. Make order_number optional with a default so inserts without it are valid
ALTER TABLE "Orders" ALTER COLUMN order_number SET DEFAULT '';

-- 2. Function to compute next daily order number atomically
CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  max_num integer;
  next_num integer;
BEGIN
  -- Get the highest order_number for today (Berlin timezone)
  SELECT COALESCE(MAX(order_number::integer), 0)
    INTO max_num
    FROM "Orders"
    WHERE created_at >= (CURRENT_DATE AT TIME ZONE 'Europe/Berlin')::timestamptz
      AND created_at < ((CURRENT_DATE + INTERVAL '1 day') AT TIME ZONE 'Europe/Berlin')::timestamptz
      AND order_number ~ '^\d+$';  -- only numeric order numbers

  next_num := (max_num + 1) % 100;
  IF next_num = 0 THEN next_num := 1; END IF;

  RETURN next_num::text;
END;
$$;

-- 3. Trigger function to auto-set order_number on INSERT
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Assign if not provided or empty
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := get_next_order_number();
  END IF;
  RETURN NEW;
END;
$$;

-- 4. Create the trigger
DROP TRIGGER IF EXISTS trg_set_order_number ON "Orders";
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON "Orders"
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();
