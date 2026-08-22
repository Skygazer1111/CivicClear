"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/shared/layout/brand";
import { Button } from "@/shared/ui/button";
import { CAMPUS_LOCATIONS } from "@/features/complaints/campus-locations";

const LIVE_EVENTS = [
  {
    place: "TP1 (Tech Park 1)",
    issue: "Elevator",
    status: "Verified",
    tone: "pending" as const,
  },
  {
    place: "UB (University Building)",
    issue: "Washroom",
    status: "In progress",
    tone: "progress" as const,
  },
  {
    place: "Java Canteen",
    issue: "Waterlogging",
    status: "Resolved",
    tone: "resolved" as const,
  },
  {
    place: "Architecture block",
    issue: "Escalator",
    status: "Submitted",
    tone: "pending" as const,
  },
  {
    place: "Vendhar Square",
    issue: "Waterlogging",
    status: "Resolved",
    tone: "resolved" as const,
  },
  {
    place: "MBA block",
    issue: "Washroom",
    status: "Verified",
    tone: "pending" as const,
  },
];

const toneClass = {
  pending: "text-status-pending",
  progress: "text-status-progress",
  resolved: "text-status-resolved",
};

type Props = {
  signedIn?: boolean;
  signedInHome?: string;
};

export function LandingExperience({ signedIn, signedInHome }: Props) {
  const [liveIndex, setLiveIndex] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setLiveIndex((i) => (i + 1) % LIVE_EVENTS.length);
      setTick((t) => t + 1);
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const visible = [
    LIVE_EVENTS[liveIndex],
    LIVE_EVENTS[(liveIndex + 1) % LIVE_EVENTS.length],
    LIVE_EVENTS[(liveIndex + 2) % LIVE_EVENTS.length],
  ];

  return (
    <>
      {/* Hero — one composition: brand, line, CTAs, full-bleed green field */}
      <section className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-end overflow-hidden sm:min-h-[calc(100dvh-4.25rem)] sm:justify-center">
        <div aria-hidden className="landing-hero-field absolute inset-0">
          <div className="landing-hero-mesh absolute inset-0" />
          <div className="landing-hero-orb landing-hero-orb-a" />
          <div className="landing-hero-orb landing-hero-orb-b" />
          <div className="landing-hero-orb landing-hero-orb-c" />
          <CampusSilhouette className="landing-skyline absolute inset-x-0 bottom-0 h-[42%] w-full opacity-[0.14] sm:h-[48%] sm:opacity-[0.18]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eef6f3] via-[#eef6f3]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
          <div className="rise-in flex items-center gap-3 sm:gap-4">
            <Image
              src="/brand/campusclean-logo.png"
              alt=""
              width={72}
              height={72}
              className="landing-logo-float h-14 w-14 rounded-[1.15rem] object-cover shadow-[0_16px_40px_rgba(15,143,120,0.28)] sm:h-[4.5rem] sm:w-[4.5rem] sm:rounded-[1.35rem]"
              priority
            />
            <h1 className="font-display text-[2.75rem] font-semibold leading-[0.95] tracking-tight text-ink sm:text-7xl md:text-8xl">
              {APP_NAME}
            </h1>
          </div>

          <p className="rise-in-delay-1 mt-5 max-w-xl font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:mt-7 sm:text-3xl">
            Campus issues, cleared.
          </p>
          <p className="rise-in-delay-2 mt-3 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
            Report waterlogging, elevators, escalators, and washrooms — then
            watch coordinators verify and resolve them across SRM.
          </p>

          <div className="rise-in-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
            {signedIn && signedInHome ? (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href={signedInHome}>Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:min-w-52 sm:w-auto">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:min-w-52 sm:w-auto"
                >
                  <Link href="/register">Create student account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Live campus pulse */}
      <section className="relative z-10 border-y border-line/50 bg-white/35 backdrop-blur-md">
        <div className="mx-auto max-w-page px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                Live on campus
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Reports moving in real time
              </h2>
            </div>
            <p
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted"
              aria-live="polite"
            >
              <span className="landing-live-dot h-2 w-2 rounded-sm bg-accent" />
              Pulse {String(tick).padStart(2, "0")}
            </p>
          </div>

          <ul className="mt-10 space-y-0">
            {visible.map((event, i) => (
              <li
                key={`${event.place}-${event.status}-${liveIndex}-${i}`}
                className="landing-live-row flex flex-col gap-1 border-t border-line/60 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div>
                  <p className="font-display text-xl font-semibold tracking-tight text-ink">
                    {event.place}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{event.issue}</p>
                </div>
                <p
                  className={`text-sm font-semibold tracking-tight ${toneClass[event.tone]}`}
                >
                  {event.status}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works — one job, no card chrome */}
      <section className="relative z-10 mx-auto max-w-page px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Built for students
        </p>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Three quiet steps from stuck to sorted
        </h2>

        <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {[
            {
              step: "01",
              title: "Pin the place",
              copy: "Pick TP1, UB, Java Canteen, or any campus block — no GPS hunt.",
            },
            {
              step: "02",
              title: "Snap & send",
              copy: "Add a photo, describe the issue, submit in under a minute.",
            },
            {
              step: "03",
              title: "Earn on truth",
              copy: "Points land only after a coordinator verifies a real report.",
            },
          ].map((item) => (
            <li key={item.step} className="landing-step">
              <p className="font-display text-4xl font-semibold tracking-tight text-accent/35">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Campus locations marquee */}
      <section className="relative z-10 overflow-hidden pb-20 sm:pb-28">
        <div className="mx-auto max-w-page px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Across campus
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Every block you already know
          </h2>
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
              <Link href="/register">Create a student account</Link>
            </Button>
          ) : null}
        </div>
      </section>
    </>
  );
}

function CampusSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#0f8f78"
        d="M0 320V210h48v-72h36v72h40V120h28v-40h36v40h24v90h52V88h44v-28h32v28h40v122h60V140h36v-56h48v56h28v70h72V96h40V64h36v32h44v114h56V160h32v-44h40v44h24v50h80V128h36v-36h44v36h28v82h64V180h40v140H0Z"
      />
    </svg>
  );
}
