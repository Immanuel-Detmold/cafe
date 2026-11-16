-- Migration: Make the daily order number wrap 99 → 1 → 2 … instead of sticking at 1.
-- The old version took MAX(order_number) of today; once 99 was reached the max
-- stayed 99, so every following order got number 1 (busiest day so far: 124
-- orders). Now the next number follows the most recently created order.

CREATE OR REPLACE FUNCTION get_next_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  last_num integer;
BEGIN
  -- Number of today's most recent numeric order (Berlin timezone)
  SELECT order_number::integer
    INTO last_num
    FROM "Orders"
    WHERE created_at >= (CURRENT_DATE AT TIME ZONE 'Europe/Berlin')::timestamptz
      AND created_at < ((CURRENT_DATE + INTERVAL '1 day') AT TIME ZONE 'Europe/Berlin')::timestamptz
      AND order_number ~ '^\d+$'  -- only numeric order numbers
    ORDER BY created_at DESC, id DESC
    LIMIT 1;

  RETURN ((COALESCE(last_num, 0) % 99) + 1)::text;
END;
$$;
