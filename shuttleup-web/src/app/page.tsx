import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Star, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <Image
          src="/images/hero-court-5.jpg"
          alt="Badminton court with players in action"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/30"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              1,000+ players across Vietnam
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-none">
              Find the Perfect{" "}
              <span className="text-primary">Badminton</span>{" "}
              Session Near You
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed">
              Stop messaging multiple groups to find an open slot. Discover active courts,
              match with players at your skill level, and book instantly.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sessions">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
                >
                  Find a Session
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/dashboard/sessions/new">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Host a Session
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
          aria-hidden="true"
        />
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────────────────── */}
      <section className="bg-background border-b py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1,000+", label: "Active Players" },
              { value: "50+",    label: "Partner Courts" },
              { value: "200+",   label: "Sessions / Week" },
              { value: "4.9 ★",  label: "Average Rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-3xl font-bold text-primary tabular-nums">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Everything You Need to Play
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              One platform to find your next game, manage your sessions, and level up your game.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group flex flex-col p-8 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Location Based</h3>
              <p className="text-muted-foreground flex-1">
                Find courts near you instantly with our interactive map and geo-search.
              </p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-6">
                Explore courts <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col p-8 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="h-14 w-14 bg-secondary text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Skill Matching</h3>
              <p className="text-muted-foreground flex-1">
                Filter sessions by skill levels to ensure competitive and fun games for everyone.
              </p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-6">
                Check your level <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col p-8 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="h-14 w-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-muted-foreground flex-1">
                Secure your slot with live availability and pay effortlessly through integrated payments.
              </p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium mt-6">
                Book now <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alternate Hero Images Strip ──────────────────────────────────────── */}
      <section className="py-12 bg-muted/40 border-t border-b overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-48 md:h-64">
            {[
              { src: "/images/hero-court-1.jpg", alt: "Indoor badminton court" },
              { src: "/images/hero-court-2.jpg", alt: "Outdoor badminton game" },
              { src: "/images/hero-court-3.jpg", alt: "Players warming up" },
              { src: "/images/hero-court-4.jpg", alt: "Tournament match" },
            ].map(({ src, alt }) => (
              <div key={src} className="relative rounded-xl overflow-hidden">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  loading="lazy"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
            Ready to Play?
          </h2>
          <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg">
            Browse our live feed of upcoming sessions happening in your area over the next 7 days.
          </p>
          <Link href="/sessions">
            <Button
              size="lg"
              className="text-base px-10 h-13 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
            >
              Browse All Sessions
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
