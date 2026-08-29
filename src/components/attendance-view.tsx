"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarField } from "@/components/brand/bar-field";
import { Wordmark } from "@/components/brand/wordmark";
import { ATTENDANCE_PASSWORD, EVENT } from "@/lib/event";
import {
  isSupabaseConfigured,
  supabase,
  type Attendee,
} from "@/lib/supabase";

const UNLOCK_KEY = "fog_attendance_unlocked";
const RECENT_MS = 90_000;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatTime(iso: string) {
  try {
    return timeFormat.format(new Date(iso));
  } catch {
    return "";
  }
}

export function AttendanceView() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      // sessionStorage unavailable — stay locked.
    }
  }, []);

  function handleUnlocked() {
    try {
      sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      // ignore — the gate still opens for this view.
    }
    setUnlocked(true);
  }

  return unlocked ? <Roll /> : <Gate onUnlock={handleUnlocked} />;
}

/* ------------------------------------------------------------------ */
/* Gate                                                                */
/* ------------------------------------------------------------------ */

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password === ATTENDANCE_PASSWORD) {
      onUnlock();
    } else {
      setFailed(true);
    }
  }

  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-rust px-5 py-16 text-cream-white">
      <div className="absolute inset-0 opacity-[0.1]">
        <BarField color="var(--cream-white)" />
      </div>

      <div className="rise relative w-full max-w-sm">
        <p className="eyebrow text-amber">{EVENT.ministry} · Staff</p>
        <h1 className="text-retro-cream mt-3 font-display text-[clamp(3rem,14vw,5rem)] leading-[0.85] uppercase">
          Attendance
        </h1>
        <p className="mt-4 leading-relaxed text-cream-white/75">
          This roll is for the team. Enter the password to see tonight&rsquo;s
          check-ins.
        </p>

        <form onSubmit={handleSubmit} className="mt-7">
          <Label htmlFor="attendance-password" className="text-cream-white/80">
            Password
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="attendance-password"
              type="password"
              value={password}
              autoFocus
              autoComplete="off"
              placeholder="••••••••"
              onChange={(event) => {
                setPassword(event.target.value);
                if (failed) setFailed(false);
              }}
              aria-invalid={failed}
              className="border-cream-white/25 bg-rust/40 text-cream-white placeholder:text-cream-white/40 focus-visible:border-amber focus-visible:ring-amber/30"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 bg-amber px-5 font-bold tracking-[0.08em] text-ink uppercase hover:bg-amber/90"
            >
              Unlock
            </Button>
          </div>
          {failed ? (
            <p role="alert" className="mt-3 text-sm font-medium text-amber">
              That password didn&rsquo;t match. Try again.
            </p>
          ) : null}
        </form>

        <p className="mt-8 text-xs text-cream-white/50">
          Cosmetic gate — placeholder until the real password is set.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Roll                                                                */
/* ------------------------------------------------------------------ */

function Roll() {
  const [rows, setRows] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const client = supabase;
    let active = true;

    (async () => {
      setLoading(true);
      const { data } = await client
        .from("attendees")
        .select("*")
        .order("created_at", { ascending: false });
      if (active && data) setRows(data as Attendee[]);
      if (active) setLoading(false);
    })();

    const channel = client
      .channel("attendees-roll")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attendees" },
        (payload) => {
          setRows((prev) => [payload.new as Attendee, ...prev]);
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      active = false;
      client.removeChannel(channel);
    };
  }, [refreshKey]);

  const total = rows.length;

  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
      <header>
        <div className="flex items-center justify-between">
          <Wordmark />
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="eyebrow inline-flex items-center gap-1.5 transition-colors hover:text-burnt"
          >
            <RefreshIcon />
            Refresh
          </button>
        </div>

        <div className="rule-thin mt-4" />

        <p className="eyebrow mt-5">
          {EVENT.dateLabel} · {EVENT.location}
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h1 className="font-display text-[clamp(3rem,12vw,5.5rem)] leading-[0.82] text-ink uppercase">
            Attendance
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl leading-none text-burnt tabular-nums">
              {total}
            </span>
            <span className="eyebrow flex items-center gap-2">
              {live ? (
                <span className="live-dot inline-block size-2 rounded-full bg-amber" />
              ) : null}
              Checked in
            </span>
          </div>
        </div>

        <div className="rule-thick mt-5" />
      </header>

      {loading ? (
        <p className="eyebrow py-16 text-center">Loading the roll…</p>
      ) : total === 0 ? (
        <EmptyState />
      ) : (
        <ol className="mt-1">
          {rows.map((attendee, index) => {
            const recent = Date.now() - new Date(attendee.created_at).getTime() < RECENT_MS;
            return (
              <li key={attendee.id} className="border-b border-ink/10">
                <div className="flex items-baseline gap-4 py-4">
                  <span className="w-8 shrink-0 font-display text-lg text-rust tabular-nums">
                    {String(total - index).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-lg font-semibold text-ink">
                        {attendee.name}
                      </p>
                      {recent ? (
                        <span className="rounded-full bg-burnt px-2 py-0.5 text-[0.6rem] font-bold tracking-wider text-cream-white uppercase">
                          Just arrived
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs font-semibold tracking-[0.12em] text-warm-gray uppercase">
                      {attendee.location} · invited by {attendee.invited_by}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-warm-gray tabular-nums">
                    {formatTime(attendee.created_at)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-xl border border-ink/12 bg-cream-white px-6 py-16 text-center">
      <div className="absolute inset-x-0 bottom-0 h-24 opacity-[0.08]">
        <BarField color="var(--burnt)" />
      </div>
      <p className="eyebrow relative">Tonight&rsquo;s roll</p>
      <p className="relative mt-2 font-display text-3xl text-ink uppercase">
        No one&rsquo;s here yet
      </p>
      <p className="relative mx-auto mt-2 max-w-xs text-warm-gray">
        The first check-in shows up here the moment it lands.
      </p>
      {!isSupabaseConfigured ? (
        <p className="eyebrow relative mt-4 text-burnt">
          Connect Supabase to go live
        </p>
      ) : null}
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
