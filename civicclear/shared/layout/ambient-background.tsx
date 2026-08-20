export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#f7fcfa_0%,_#eef6f3_42%,_#e5f1f7_100%)]" />
      <div className="ambient-aurora absolute -left-[20%] top-[-10%] h-[36rem] w-[36rem] rounded-full bg-[conic-gradient(from_120deg,#c6f0de,#cfeaf6,#f8d9c8,#c6f0de)] opacity-40 blur-3xl" />
      <div className="ambient-aurora absolute -right-[15%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-[conic-gradient(from_220deg,#cfeaf6,#f6e6d4,#c6f0de,#cfeaf6)] opacity-35 blur-3xl [animation-delay:2s]" />
      <div className="ambient-blob ambient-blob-a left-[-10%] top-[-8%] h-[30rem] w-[30rem] bg-mint-soft/95" />
      <div className="ambient-blob ambient-blob-b right-[-12%] top-[8%] h-[26rem] w-[26rem] bg-sky-soft/95" />
      <div className="ambient-blob ambient-blob-c bottom-[-14%] left-[18%] h-[24rem] w-[24rem] bg-sand-soft/85" />
      <div className="ambient-blob ambient-blob-d bottom-[10%] right-[8%] h-[18rem] w-[18rem] bg-coral-soft/70" />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/50 to-transparent" />
    </div>
  );
}
