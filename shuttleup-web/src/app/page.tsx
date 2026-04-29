import { BeloPublicSimulator } from "@/components/belo/belo-public-simulator";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  HeroSection,
  StatsStrip,
  FeaturesSection,
  GalleryStrip,
  CtaBanner,
} from "@/components/homepage/homepage-sections";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero Section — staggered text reveal + Ken Burns bg ────────────── */}
      <HeroSection />

      {/* ── Stats Strip — count-up numbers + stagger fade-in ──────────────── */}
      <StatsStrip />

      {/* ── Features Section — cards stagger-in ──────────────────────────── */}
      <FeaturesSection />

      {/* ── BELo Ranking Simulator — scroll reveal ───────────────────────── */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <BeloPublicSimulator />
          </AnimatedSection>
        </div>
      </section>

      {/* ── Gallery Strip — staggered image reveal ───────────────────────── */}
      <GalleryStrip />

      {/* ── CTA Banner — fade-in reveal ──────────────────────────────────── */}
      <CtaBanner />

    </div>
  );
}
