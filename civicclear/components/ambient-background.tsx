export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#eef8f4_0%,_#f3f8f6_45%,_#eaf3f7_100%)]" />
      <div className="ambient-blob ambient-blob-a left-[-8%] top-[-6%] h-[28rem] w-[28rem] bg-mint-soft/90" />
      <div className="ambient-blob ambient-blob-b right-[-10%] top-[12%] h-[24rem] w-[24rem] bg-sky-soft/90" />
      <div className="ambient-blob ambient-blob-c bottom-[-12%] left-[22%] h-[22rem] w-[22rem] bg-sand-soft/80" />
    </div>
  );
}
