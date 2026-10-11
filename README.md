# MapleLeaf Education

Responsive Student / Agent / College portal for a Canada study agency. The local demo adapter runs without external accounts and persists workflow state in `localStorage`; the Supabase schema and RLS policies are ready for a connected environment.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and use password `123456` with:

- `student@demo.com`
- `agent@demo.com`
- `college@demo.com`

Use “Reset demo data” in the portal sidebar to restart the scenario.

## Supabase setup

1. Create a Supabase project and run `supabase/migrations/001_init.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill the project URL, publishable key and server-only service role key.
3. Disable email confirmation for the pilot, then run `npm run seed:demo`.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. The private Storage bucket uses signed URLs.

The current UI intentionally defaults to the local demo adapter so the complete workflow can be reviewed before wiring the repository layer to a live Supabase project.

## Quality gates

```bash
npm test
npm run typecheck
npm run build
```

## Deploy

Import the private GitHub repository into Vercel, add the same environment variables, deploy a staging project first, and remove demo accounts before production. This pilot has no SMTP, password recovery, payment gateway, OCR, AI recommendation, or malware scanning.
