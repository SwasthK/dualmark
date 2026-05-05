"use client";

import dynamic from "next/dynamic";

const Beams = dynamic(() => import("./beams"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" aria-hidden />,
});

export function BeamsBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.55]">
        <Beams
          beamWidth={2.4}
          beamHeight={22}
          beamNumber={14}
          lightColor="#c6fe1e"
          speed={1.6}
          noiseIntensity={1.4}
          scale={0.18}
          rotation={28}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-bg)]/40 to-[var(--color-bg)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
    </div>
  );
}
