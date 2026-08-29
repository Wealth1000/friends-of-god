"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sweep } from "@/components/brand/sweep";
import { EVENT } from "@/lib/event";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Status = "idle" | "submitting" | "done";

const FIELDS = [
  {
    name: "name",
    label: "Your name",
    placeholder: "e.g. Ama Boateng",
    autoComplete: "name",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone",
    placeholder: "e.g. 024 000 0000",
    autoComplete: "tel",
    type: "tel",
  },
  {
    name: "location",
    label: "Where you're from",
    placeholder: "e.g. Nungua",
    autoComplete: "off",
    type: "text",
  },
  {
    name: "invited_by",
    label: "Who invited you",
    placeholder: "The friend who brought you",
    autoComplete: "off",
    type: "text",
    hint: "Every seat here started with an invitation.",
  },
] as const;

export function CheckInForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Live tally for the "N have checked in" touches (skipped until connected).
  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) return;
      const { count: total } = await supabase
        .from("attendees")
        .select("*", { count: "exact", head: true });
      if (active && typeof total === "number") setCount(total);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      location: String(data.get("location") ?? "").trim(),
      invited_by: String(data.get("invited_by") ?? "").trim(),
    };

    if (!payload.name || !payload.phone || !payload.location || !payload.invited_by) {
      setError("Fill in all four so we can welcome you properly.");
      return;
    }

    setStatus("submitting");

    // Not connected yet — show the confirmation as a local preview.
    if (!isSupabaseConfigured || !supabase) {
      await new Promise((resolve) => setTimeout(resolve, 450));
      setPreview(true);
      setCount((current) => (current ?? 0) + 1);
      setSavedName(payload.name);
      setStatus("done");
      return;
    }

    const { error: insertError } = await supabase.from("attendees").insert(payload);
    if (insertError) {
      setStatus("idle");
      setError("That didn't save. Check your connection and try again.");
      return;
    }

    setCount((current) => (current ?? 0) + 1);
    setSavedName(payload.name);
    setStatus("done");
  }

  function reset() {
    formRef.current?.reset();
    setSavedName("");
    setPreview(false);
    setError(null);
    setStatus("idle");
  }

  if (status === "done") {
    const first = savedName.split(" ")[0] || savedName;
    return (
      <div className="rise relative">
        <p className="eyebrow">{EVENT.series} · Checked in</p>
        <div className="bloom relative mt-3">
          <h1 className="text-retro font-display text-[clamp(3rem,12vw,6rem)] leading-[0.85] text-burnt uppercase">
            You&rsquo;re in,
            <br />
            {first}.
          </h1>
        </div>
        <Sweep className="mt-6 h-6" color="var(--rust)" />
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
          {count ? (
            <>
              Friend{" "}
              <span className="font-bold text-burnt">#{count}</span> through the
              door tonight.{" "}
            </>
          ) : null}
          Grab a seat — we saved you one.
        </p>
        {preview ? (
          <p className="eyebrow mt-4 text-burnt">
            Preview only · not saved (backend not connected)
          </p>
        ) : null}
        <Button
          onClick={reset}
          variant="outline"
          className="mt-8 h-12 rounded-md border-ink/25 bg-transparent px-6 text-sm font-bold tracking-[0.08em] text-ink uppercase hover:bg-ink/5"
        >
          Check in someone else
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="eyebrow rise">
        {EVENT.series} · Check in
        {count && count > 0 ? ` · ${count} here` : ""}
      </p>
      <h1 className="text-retro rise rise-2 mt-3 font-display text-[clamp(3.5rem,15vw,7rem)] leading-[0.82] text-burnt uppercase">
        Check in
      </h1>
      <p className="rise rise-3 mt-5 max-w-md text-lg leading-relaxed text-ink/80">
        You&rsquo;re among friends. Tell us who&rsquo;s here and we&rsquo;ll add
        you to tonight&rsquo;s roll.
      </p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="rise rise-3 mt-8"
      >
        <div className="rounded-xl border border-ink/12 bg-cream-white p-5 shadow-[0_1px_0_rgba(23,19,16,0.04),0_20px_44px_-30px_rgba(23,19,16,0.55)] sm:p-7">
          <div className="space-y-5">
            {FIELDS.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  aria-describedby={"hint" in field ? `${field.name}-hint` : undefined}
                />
                {"hint" in field ? (
                  <p id={`${field.name}-hint`} className="text-xs text-warm-gray">
                    {field.hint}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-5 border-l-2 border-destructive pl-3 text-sm font-medium text-rust"
            >
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 h-13 w-full rounded-md text-base font-bold tracking-[0.08em] uppercase"
          >
            {status === "submitting" ? "Checking you in…" : "Check me in"}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs tracking-wide text-warm-gray">
          {EVENT.dateLabel} · {EVENT.location}
        </p>
      </form>
    </div>
  );
}
