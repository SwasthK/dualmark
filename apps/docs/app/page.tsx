import { Adapters } from "./_components/adapters";
import { Architecture } from "./_components/architecture";
import { ConformanceDemo } from "./_components/conformance-demo";
import { Converters } from "./_components/converters";
import { CTA } from "./_components/cta";
import { Hero } from "./_components/hero";
import { Transform } from "./_components/transform";
import { TrustStrip } from "./_components/trust-strip";

export default function HomePage() {
  return (
    <main className="relative isolate">
      <Hero />
      <TrustStrip />
      <Transform />
      <Architecture />
      <ConformanceDemo />
      <Adapters />
      <Converters />
      <CTA />
    </main>
  );
}
