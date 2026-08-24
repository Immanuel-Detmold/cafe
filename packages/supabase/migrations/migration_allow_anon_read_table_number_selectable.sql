-- Migration: Allow anonymous (public menu card) clients to read only the
-- 'table_number_selectable' AppData flag. AppData otherwise only allows
-- access to authenticated (admin) users, and holds some internal values
-- (server_ip, server_port) that must stay private — so this policy is
-- scoped narrowly to the one public-safe key, not a blanket SELECT grant.

CREATE POLICY "Allow anon read of table_number_selectable"
ON "AppData"
FOR SELECT
TO anon
USING (key = 'table_number_selectable');
