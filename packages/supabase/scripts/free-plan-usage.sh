#!/usr/bin/env zsh
# Prints the usage values that the Supabase Free plan limits (read-only).
# Run from the repo root: zsh packages/supabase/scripts/free-plan-usage.sh
# Egress and edge-function invocations are not exposed here: check the dashboard
# (see docs/SUPABASE_FREE_PLAN.md).

set -e
REF=hmwxeqgcfhhumndveboe
ENV_FILE="$(dirname "$0")/../../frontend/.env.local"
TOKEN=$(grep '^SUPABASE_ACCESS_TOKEN=' "$ENV_FILE" | cut -d= -f2-)
[[ -n "$TOKEN" ]] || { echo "SUPABASE_ACCESS_TOKEN fehlt in $ENV_FILE"; exit 1; }

q() {
  curl -s -X POST "https://api.supabase.com/v1/projects/$REF/database/query" \
    -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d "{\"query\":$(printf '%s' "$1" | /usr/bin/jq -Rs .)}"
}

echo "Projektstatus: $(curl -s "https://api.supabase.com/v1/projects/$REF" \
  -H "Authorization: Bearer $TOKEN" | /usr/bin/jq -r .status)"

echo "\n== Datenbank (Limit 500 MB)"
q "select pg_size_pretty(pg_database_size(current_database())) as size" |
  /usr/bin/jq -r '.[0].size'

echo "\n== Größte Tabellen"
q "select n.nspname||'.'||c.relname as t, pg_size_pretty(pg_total_relation_size(c.oid)) as size
   from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where c.relkind = 'r' and n.nspname in ('public', 'auth', 'storage')
   order by pg_total_relation_size(c.oid) desc limit 5" |
  /usr/bin/jq -r '.[] | "\(.size)\t\(.t)"'

echo "\n== Storage (Limit 1 GB)"
q "select bucket_id, count(*) as files,
     pg_size_pretty(sum((metadata->>'size')::bigint)) as size
   from storage.objects group by bucket_id
   order by sum((metadata->>'size')::bigint) desc nulls last" |
  /usr/bin/jq -r '.[] | "\(.size)\t\(.files) Dateien\t\(.bucket_id)"'

echo "\n== Nutzer (Limit 50.000 aktive pro Monat)"
q "select count(*) as total,
     count(*) filter (where last_sign_in_at > now() - interval '30 days') as active
   from auth.users" |
  /usr/bin/jq -r '.[0] | "\(.active) aktiv in 30 Tagen, \(.total) gesamt"'

echo "\n== Letzte Aktivität (Pause nach 7 Tagen ohne Nutzung)"
q "select max(created_at) as last from \"Orders\"" | /usr/bin/jq -r '"Letzte Bestellung: \(.[0].last)"'
