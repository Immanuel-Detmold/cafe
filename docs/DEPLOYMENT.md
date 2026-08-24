# Deployment

- **Production**: Coolify. Domain: `immanuel-cafe.de`.
- **Dev previews**: Netlify (PR/branch previews only — not production).
- **Build**: `pnpm build` → `tsc && vite build` (runs per-workspace via the root `build` script).
- **Env vars** (both environments need these set): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- **Optional env var**: `VITE_GOOGLE_PAY_MERCHANT_ID` — enables the Google Pay button in the SumUp Card Widget on the Menükarte checkout (`MenuCheckout.tsx`). Not a secret (it's baked into the client bundle by Vite regardless — same as the Supabase publishable key), so plain env var, not a Docker Build Secret. Getting the button to actually render also requires the site's domain to be separately registered and approved under **Google Pay API → Integrations → Integrate with your website** in the Google Pay & Wallet Console (domain `immanuel-cafe.de`, approved 2026-08-24) — this is distinct from, and in addition to, the general Business Profile approval, and per SumUp support must be fully approved before the button renders in production (it will not show pre-approval). To produce the buyflow screenshots Google requires for that review before approval, append `#sumup-widget:google-pay-demo-mode` to the checkout URL to force the widget to render the Google Pay button — see `https://developer.sumup.com/online-payments/apm/google-pay#screenshots-for-google`.
- Vite base path is `/cafe` — keep this in mind if a deployment target changes the serving path.

If you find deployment config (Netlify config, Coolify config/webhooks, CI) while working, note the exact file paths here so future sessions don't have to search for them again.
