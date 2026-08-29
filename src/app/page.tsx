import Link from "next/link";

import { BarField } from "@/components/brand/bar-field";
import { Wordmark } from "@/components/brand/wordmark";
import { CheckInForm } from "@/components/check-in-form";
import { EVENT } from "@/lib/event";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Masthead — newspaper header */}
      <header className="mx-auto w-full max-w-3xl px-5 pt-6">
        <div className="flex items-center justify-between gap-4">
          <Wordmark />
          <p className="eyebrow hidden sm:block">{EVENT.edition}</p>
        </div>
        <div className="rule-thin mt-4" />
        <div className="mt-3 flex items-center justify-between">
          <p className="eyebrow">{EVENT.dateLabel}</p>
          <p className="eyebrow">{EVENT.location}</p>
        </div>
      </header>

      {/* Hero + check-in */}
      <main className="relative flex-1 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-[0.07]"
        >
          <div className="mx-auto h-full max-w-3xl px-5">
            <div className="relative h-full">
              <BarField color="var(--burnt)" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-5 pt-10 pb-16 sm:pt-14">
          <CheckInForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-rust text-cream-white">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Wordmark tone="cream" />
            <p className="mt-2 text-xs text-cream-white/60">
              {EVENT.dateLabel} · {EVENT.location}
            </p>
          </div>
          <Link
            href="/attendance"
            className="eyebrow inline-flex w-fit items-center gap-1.5 text-amber transition-colors hover:text-cream-white"
          >
            Attendance
            <span aria-hidden>→</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
