# Friends of God — Attendance App — Project Scaffold

## Stack
- Next.js (App Router, TypeScript, Tailwind)
- Supabase (Postgres + client library)
- Deployed on Vercel
- Package manager: pnpm

## 1. Create the project
pnpm create next-app friends-of-god --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd friends-of-god
pnpm add @supabase/supabase-js

## 2. Supabase setup
- Create a new project at supabase.com
- In SQL editor, create the table:

create table attendees (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  location text not null,
  invited_by text not null,
  created_at timestamp with time zone default now()
);

- Grab from Project Settings > API:
  - Project URL
  - anon public key

## 3. Environment variables
Create `.env.local` in project root:

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

(Add the same two vars in Vercel project settings when you deploy.)

## 4. File structure

src/
  app/
    page.tsx              -> signup form (/)
    attendance/
      page.tsx            -> live attendance list (/attendance)
  lib/
    supabase.ts            -> Supabase client init

## 5. Supabase client (src/lib/supabase.ts)

import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

## 6. Pages to build
- `/` — form with Name, Phone, Location, Invited By. On submit, insert row into `attendees`.
- `/attendance` — fetch all rows from `attendees`, render as a list/table, ordered by created_at.

## 7. Deploy
- Push to GitHub
- Import repo in Vercel
- Add the two env vars in Vercel project settings
- Deploy (Vercel auto-detects pnpm from pnpm-lock.yaml)

## 8. QR code
- Once live, generate a QR code pointing at the deployed root URL (or /signup if you rename it)