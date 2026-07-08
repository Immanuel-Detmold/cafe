-- Migration: Link Cafe Cards to the Order that created them, so deleting
-- an order also deletes any Cafe Cards it minted.
ALTER TABLE "CafeCards"
  ADD COLUMN order_id bigint REFERENCES "Orders"(id) ON DELETE CASCADE;
