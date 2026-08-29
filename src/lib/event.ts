/**
 * Event details + gate config.
 * These are placeholders — safe to edit per gathering. They drive the
 * editorial labels (date, location, edition) across the site.
 */
export const EVENT = {
  ministry: "Friends of God",
  series: "Azusa",
  dateLabel: "29 August 2026",
  location: "Nungua • Bank Road",
  edition: "Exceptional Group 1",
} as const;

/**
 * Cosmetic password gate for /attendance.
 *
 * TODO(password): swap for the real one when the client provides it.
 * Set NEXT_PUBLIC_ATTENDANCE_PASSWORD in .env.local to change it without
 * editing code. Note: this only hides the UI — with the public anon key,
 * the data is still reachable unless the table is locked down with RLS.
 */
export const ATTENDANCE_PASSWORD =
  process.env.NEXT_PUBLIC_ATTENDANCE_PASSWORD ?? "friends";
