"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Star, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger-container";
import { useTranslations } from "next-intl";

/* ── Framer Motion Variants ─────────────────────────────────────────────── */

const heroContentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ── Gallery Data ────────────────────────────────────────────────────────── */

const galleryImages = [
  { src: "/images/hero-court-1.jpg", alt: "Indoor badminton court" },
  { src: "/images/hero-court-2.jpg", alt: "Outdoor badminton game" },
  { src: "/images/hero-court-3.jpg", alt: "Players warming up" },
  { src: "/images/hero-court-4.jpg", alt: "Tournament match" },
];

/* ── Component ───────────────────────────────────────────────────────────── */

export function HeroSection() {
  const t = useTranslations('HomePage.hero');
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background photo with Ken Burns zoom */}
      <Image
        src="/images/hero-court-5.jpg"
        alt="Badminton court with players in action"
        fill
        priority
        className="object-cover object-center animate-ken-burns"
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/30"
        aria-hidden="true"
      />

      {/* Content — staggered entrance */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          className="max-w-2xl"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Live badge — slide in from left */}
          <motion.div
            variants={heroChildVariants}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            {t('badge')}
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={heroChildVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-none"
          >
            {t.rich('title', {
              primary: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroChildVariants}
            className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={heroChildVariants} className="flex flex-col sm:flex-row gap-4">
            <Link href="/sessions">
              <Button
                size="lg"
                className="h-13 px-8 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30"
              >
                {t('findSession')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/dashboard/sessions/new">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                {t('hostSession')}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}

export function StatsStrip() {
  const t = useTranslations('HomePage.stats');
  
  const statsLocales = [
    { value: 1000, suffix: "+", label: t('players') },
    { value: 50, suffix: "+", label: t('courts') },
    { value: 200, suffix: "+", label: t('sessions') },
    { value: 4.9, suffix: " ★", label: t('rating'), isDecimal: true },
  ];

  return (
    <section className="bg-background border-b py-10">
      <StaggerContainer
        className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        staggerDelay={0.12}
      >
        {statsLocales.map(({ value, suffix, label, isDecimal }) => (
          <StaggerItem key={label}>
            <div className="font-display text-3xl font-bold text-primary tabular-nums">
              {isDecimal ? (
                <>{value}{suffix}</>
              ) : (
                <AnimatedCounter value={value} suffix={suffix} />
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{label}</div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

export function FeaturesSection() {
  const t = useTranslations('HomePage.features');
  
  const featureLocales = [
    {
      icon: MapPin,
      title: t('items.location.title'),
      description: t('items.location.desc'),
      cta: t('items.location.cta'),
      iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Star,
      title: t('items.skill.title'),
      description: t('items.skill.desc'),
      cta: t('items.skill.cta'),
      iconBg: "bg-secondary text-primary",
    },
    {
      icon: Calendar,
      title: t('items.booking.title'),
      description: t('items.booking.desc'),
      cta: t('items.booking.cta'),
      iconBg: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {featureLocales.map(({ icon: Icon, title, description, cta, iconBg }) => (
            <StaggerItem key={title}>
              <div className="group flex flex-col p-8 rounded-2xl border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <div className={`h-14 w-14 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground flex-1">{description}</p>
                <div className="flex items-center gap-1 text-primary text-sm font-medium mt-6">
                  {cta} <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export function GalleryStrip() {
  return (
    <section className="py-12 bg-muted/40 border-t border-b overflow-hidden">
      <StaggerContainer
        className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 h-48 md:h-64"
        staggerDelay={0.1}
      >
        {galleryImages.map(({ src, alt }) => (
          <StaggerItem key={src}>
            <div className="relative rounded-xl overflow-hidden h-full">
              <Image
                src={src}
                alt={alt}
                fill
                loading="lazy"
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

export function CtaBanner() {
  const t = useTranslations('HomePage.cta');
  
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
          {t('title')}
        </h2>
        <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto text-lg">
          {t('subtitle')}
        </p>
        <Link href="/sessions">
          <Button
            size="lg"
            className="text-base px-10 h-13 bg-white text-primary hover:bg-white/90 font-semibold shadow-lg"
          >
            {t('button')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </AnimatedSection>
    </section>
  );
}
