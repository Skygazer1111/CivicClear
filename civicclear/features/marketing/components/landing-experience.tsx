"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/shared/layout/brand";
import { Button } from "@/shared/ui/button";
import { CAMPUS_LOCATIONS } from "@/features/complaints/campus-locations";

const LIVE_EVENTS = [
  {
    place: "TP1",
    issue: "Lift stuck near the third floor",
    status: "Verified",
    tone: "pending" as const,
  },
  {
    place: "University Building",
    issue: "Washroom needs attention",
    status: "Coordinator on it",
    tone: "progress" as const,
  },
  {
    place: "Java Canteen",
    issue: "Waterlogging after rain",
    status: "Cleared",
    tone: "resolved" as const,
  },
  {
    place: "Architecture block",
    issue: "Escalator not moving",
    status: "Submitted",
    tone: "pending" as const,
  },
  {
    place: "Vendhar Square",
    issue: "Pathway blocked",
    status: "Cleared",
    tone: "resolved" as const,
  },
  {
    place: "MBA block",
    issue: "Washroom refill needed",
    status: "Verified",
    tone: "pending" as const,
  },
];

const toneClass = {
  pending: "text-amber-200",
  progress: "text-sky-200",
  resolved: "text-emerald-200",
};

const STUDENT_STEPS = [
  {
    step: "01",
    title: "Spot it",
    copy: "See waterlogging, a broken lift, or a messy washroom between classes.",
  },
  {
    step: "02",
    title: "Post it",
    copy: "Pick the block, add a photo, and send it before your next lecture starts.",
  },
  {
    step: "03",
    title: "Track it",
    copy: "Watch coordinators verify, resolve, and keep the campus moving.",
  },
];

const HERO_STATS = [
  ["10", "campus spots"],
  ["60s", "to report"],
  ["+15", "clean points"],
];

const ISSUE_CHIPS = [
  "Waterlogging",
  "Elevator",
  "Escalator",
  "Washroom",
  "Campus block",
  "Photo proof",
  "Coordinator queue",
  "Points",
];

const FEATURE_CARDS = [
  {
    title: "Made for the between-class rush",
    copy: "No long forms. No location confusion. Just the places SRM students already know.",
  },
  {
    title: "Photos make it real",
    copy: "Every report carries visual proof, so coordinators can decide fast.",
  },
  {
    title: "Clean campus energy",
    copy: "Earn points for useful reports and see what got fixed around you.",
  },
];

type Props = {
  signedIn?: boolean;
  signedInHome?: string;
};

export function LandingExperience({ signedIn, signedInHome }: Props) {
  const [liveIndex, setLiveIndex] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setLiveIndex((i) => (i + 1) % LIVE_EVENTS.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const visible = [
    LIVE_EVENTS[liveIndex],
    LIVE_EVENTS[(liveIndex + 1) % LIVE_EVENTS.length],
    LIVE_EVENTS[(liveIndex + 2) % LIVE_EVENTS.length],
  ];

  return (
    <>
      <section className="landing-campus-hero relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-ink text-white sm:min-h-[calc(100dvh-4.25rem)]">
        <Image
          src="/brand/srm-campus.webp"
          alt="Aerial view of SRM Institute of Science and Technology campus"
          fill
          priority
          sizes="100vw"
          className="landing-campus-photo object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(44,255,203,0.28),transparent_28%),linear-gradient(110deg,rgba(3,12,18,0.92)_0%,rgba(6,26,34,0.82)_38%,rgba(2,20,17,0.52)_70%,rgba(3,12,18,0.74)_100%)]" />
        <div aria-hidden className="landing-hero-grain absolute inset-0 opacity-[0.18]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-3.5rem)] w-full max-w-page items-center gap-10 px-4 py-12 sm:min-h-[calc(100dvh-4.25rem)] sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="rise-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50 shadow-2xl shadow-black/20 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,255,205,0.9)]" />
              SRM campus, cleaned by students
            </div>

            <h1 className="rise-in-delay-1 mt-5 max-w-4xl font-display text-[3.15rem] font-semibold leading-[0.9] tracking-tight text-white drop-shadow-2xl sm:text-7xl lg:text-8xl">
              Make campus problems impossible to ignore.
            </h1>
            <p className="rise-in-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-white/78 sm:text-xl">
              {APP_NAME} turns quick student reports into a live campus cleanup
              feed. Snap the issue, choose the SRM block, and track it until a
              coordinator clears it.
            </p>

            <div className="rise-in-delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {signedIn && signedInHome ? (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-white text-ink hover:bg-emerald-50 sm:w-auto"
                >
                  <Link href={signedInHome}>Open my dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="w-full bg-white text-ink hover:bg-emerald-50 sm:min-w-52 sm:w-auto"
                  >
                    <Link href="/register">Start reporting</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full border-white/35 bg-white/10 text-white hover:bg-white/20 sm:min-w-44 sm:w-auto"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="rise-in-delay-4 mt-9 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
              {HERO_STATS.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 backdrop-blur-md sm:px-4"
                >
                  <p className="font-display text-2xl font-semibold leading-none text-white sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-white/62">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rise-in-delay-2 relative mx-auto w-full max-w-md lg:ml-auto">
            <div aria-hidden className="landing-phone-glow absolute -inset-10 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="landing-phone-card relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/13 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.38)] backdrop-blur-2xl sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                    Live campus pulse
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                    Reports right now
                  </h2>
                </div>
                <Image
                  src="/brand/campusclean-logo.png"
                  alt=""
                  width={44}
                  height={44}
                  className="rounded-2xl shadow-lg shadow-black/20"
                />
              </div>

              <ul className="mt-5 space-y-3" aria-live="polite">
                {visible.map((event, i) => (
                  <li
                    key={`${event.place}-${event.status}-${liveIndex}-${i}`}
                    className="landing-live-card rounded-2xl border border-white/13 bg-black/22 p-4"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{event.place}</p>
                        <p className="mt-1 text-sm leading-snug text-white/66">
                          {event.issue}
                        </p>
                      </div>
                      <p
                        className={`shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold ${toneClass[event.tone]}`}
                      >
                        {event.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-2xl bg-emerald-300 px-4 py-3 text-ink shadow-lg shadow-emerald-900/20">
                <p className="text-xs font-bold uppercase tracking-[0.16em]">
                  Student streak
                </p>
                <p className="mt-1 font-display text-2xl font-semibold">
                  12 clean actions this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="page-kicker">Built for students</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Cleaner campus, less admin energy.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            CampusClean feels like a student app, not a complaint office. Quick
            posts, visible progress, and a feed that makes every fix feel
            shared.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-3">
          {STUDENT_STEPS.map((item) => (
            <li
              key={item.step}
              className="landing-bento-card group rounded-[1.75rem] border border-white/75 bg-white/64 p-6 shadow-[0_18px_55px_rgba(16,56,46,0.08)] backdrop-blur-md"
            >
              <p className="font-display text-5xl font-semibold leading-none text-accent/25 transition-colors group-hover:text-accent/45">
                {item.step}
              </p>
              <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative z-10 overflow-hidden bg-ink py-16 text-white sm:py-24">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(15,143,120,0.38),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(207,234,246,0.22),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-page gap-5 px-4 sm:px-6 lg:grid-cols-3">
          {FEATURE_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-6 backdrop-blur-md"
            >
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {card.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="landing-chip-cloud relative mt-12" aria-hidden>
          <div className="landing-chip-track">
            {[...ISSUE_CHIPS, ...ISSUE_CHIPS].map((chip, i) => (
              <span key={`${chip}-${i}`} className="landing-chip">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <div className="rounded-[2rem] border border-line/60 bg-white/72 p-6 shadow-[0_24px_70px_rgba(16,56,46,0.08)] backdrop-blur-md sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="page-kicker">Across SRM</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Every block students actually say out loud.
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                Pick from known campus locations instead of fighting with GPS.
                That keeps reports fast and makes coordinator queues clearer.
              </p>
            </div>
          </div>
        </div>

        <div className="landing-marquee mt-10" aria-hidden>
          <div className="landing-marquee-track">
            {[...CAMPUS_LOCATIONS, ...CAMPUS_LOCATIONS].map((place, i) => (
              <span key={`${place}-${i}`} className="landing-marquee-item">
                {place}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-page justify-center px-4 sm:px-6">
          {!signedIn ? (
            <Button asChild size="lg">
              <Link href="/register">Join the campus cleanup</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </>
  );
}
