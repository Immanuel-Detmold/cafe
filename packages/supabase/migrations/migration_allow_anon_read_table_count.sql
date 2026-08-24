-- Migration: Allow anonymous (public menu card) clients to read only the
-- 'table_count' AppData key, so the customer-facing table-number picker
-- reflects the configured table count. Scoped narrowly like
-- migration_allow_anon_read_table_number_selectable.sql — AppData otherwise
-- only allows access to authenticated (admin) users.

DROP POLICY IF EXISTS "Allow anon read of table_count" ON "AppData";

CREATE POLICY "Allow anon read of table_count"
ON "AppData"
FOR SELECT
TO anon
USING (key = 'table_count');
