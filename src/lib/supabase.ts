import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when both Supabase env vars are present.
 * Lets the UI render and demo cleanly before the backend is wired up.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Supabase client, or null until env vars are set (see .env.local.example). */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

/** One person's check-in — mirrors the `attendees` table in PROJECT.md. */
export type Attendee = {
  id: string;
  name: string;
  phone: string;
  location: string;
  invited_by: string;
  created_at: string;
};

/** Shape sent on insert (server fills id + created_at). */
export type NewAttendee = Pick<
  Attendee,
  "name" | "phone" | "location" | "invited_by"
>;
