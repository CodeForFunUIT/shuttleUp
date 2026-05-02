"use client";

import { BeloHeroSection } from "@/components/belo/belo-hero-section";
import { BeloHowItWorks } from "@/components/belo/belo-how-it-works";
import { BeloTierTable } from "@/components/belo/belo-tier-table";
import { BeloSimulator } from "@/components/belo/belo-simulator";

export default function BeloPage() {
  return (
    <div className="space-y-10">
      <BeloHeroSection />
      <BeloHowItWorks />
      <BeloTierTable />
      <BeloSimulator />
    </div>
  );
}
