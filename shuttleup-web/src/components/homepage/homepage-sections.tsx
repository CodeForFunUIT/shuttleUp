"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  Calendar,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { StaggerContainer, StaggerItem } from "@/components/ui/stagger-container";
import { useTranslations } from "next-intl";

/* ── Framer Motion Variants ─────────────────────────────────────────────── */

const heroContentVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Gallery Data ────────────────────────────────────────────────────────── */

const galleryImages = [
  { src: "/images/hero-court-1.jpg", alt: "Indoor badminton tournament court" },
  { src: "/images/hero-court-2.jpg", alt: "Outdoor doubles badminton match" },
  { src: "/images/hero-court-3.jpg", alt: "Badminton players warming up" },
  { src: "/images/hero-court-4.jpg", alt: "Championship smash in action" },
];

/* ── Hero Section ───────────────────────────────────────────────────────── */

export function HeroSection() {
  const t = useTranslations('HomePage.hero');
  
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0B0E14]">
      {/* Background photo with subtle Ken Burns zoom */}
      <Image
        src="/images/hero-court-5.jpg"
        alt="Championship Badminton Court"
        fill
        priority
        className="object-cover object-center opacity-40 animate-ken-burns scale-105"
        sizes="100vw"
      />

      {/* Radiant Gradient & Court Grid Overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/85 to-[#0B0E14]/50 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Content — staggered entrance */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          className="max-w-3xl"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Live Activity Badge */}
          <motion.div
            variants={heroChildVariants}
            className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary mb-6 glow-gold-subtle"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" aria-hidden="true" />
            <Zap className="h-3.5 w-3.5 fill-primary" aria-hidden="true" />
            <span>{t('badge')}</span>
          </motion.div>

          {/* Headline with Gold metallic text gradient */}
          <motion.h1
            variants={heroChildVariants}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 uppercase leading-[0.95]"
          >
            {t.rich('title', {
              primary: (chunks) => <span className="text-gradient-gold">{chunks}</span>
            })}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroChildVariants}
            className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs with Gold Glow */}
          <motion.div variants={heroChildVariants} className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link href="/sessions">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 glow-gold cursor-pointer transition-transform duration-200 active:scale-95"
              >
                {t('findSession')}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/dashboard/sessions/new">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold border-white/20 bg-white/5 text-white hover:bg-white/15 hover:border-primary/50 backdrop-blur-md cursor-pointer transition-all duration-200"
              >
                {t('hostSession')}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            variants={heroChildVariants}
            className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-400 pt-4 border-t border-white/10"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Ghép trình BELo công bằng</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Chủ sân & Host xác thực</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-400" />
              <span>Cộng đồng 1,000+ tay vợt</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade into page canvas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0B0E14] to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}

/* ── Stats Strip ────────────────────────────────────────────────────────── */

export function StatsStrip() {
  const t = useTranslations('HomePage.stats');
  
  const statsLocales = [
    { value: 1000, suffix: "+", label: t('players'), highlight: "Tay vợt hoạt động" },
    { value: 50, suffix: "+", label: t('courts'), highlight: "Sân chuẩn thi đấu" },
    { value: 200, suffix: "+", label: t('sessions'), highlight: "Kèo mỗi tuần" },
    { value: 4.9, suffix: " ★", label: t('rating'), isDecimal: true, highlight: "Điểm cộng đồng" },
  ];

  return (
    <section className="relative bg-[#131822] border-y border-white/8 py-10">
      <StaggerContainer
        className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        staggerDelay={0.1}
      >
        {statsLocales.map(({ value, suffix, label, isDecimal, highlight }) => (
          <StaggerItem key={label}>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors">
              <div className="font-display text-4xl sm:text-5xl font-black text-primary tabular-nums tracking-tight">
                {isDecimal ? (
                  <>{value}{suffix}</>
                ) : (
                  <AnimatedCounter value={value} suffix={suffix} />
                )}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-1">{label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{highlight}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

/* ── Bento Grid Features Section ────────────────────────────────────────── */

export function FeaturesSection() {
  const t = useTranslations('HomePage.features');

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs font-semibold text-primary mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>TÍNH NĂNG ĐỘT PHÁ</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t('subtitle')}
          </p>
        </AnimatedSection>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: BELo Smart Ranking (Span 2 cols) */}
          <AnimatedSection className="md:col-span-2 lg:col-span-2 p-8 rounded-2xl border border-white/10 bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-primary/30 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Chống Smurf & Cân Bằng Kèo</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black mt-1 mb-3">Hệ Thống Xếp Hạng BELo Độc Quyền</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Tự động tính toán điểm thực lực theo Elo sau mỗi set đấu. Không còn nỗi lo bị &apos;bán hành&apos; bởi tay vợt quá chênh lệch trình độ.
              </p>
            </div>
            {/* Visual Rank Preview Pill */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center font-display font-black text-primary text-base">G</div>
                <div>
                  <div className="text-xs font-bold text-foreground">Gold Tier III</div>
                  <div className="text-[11px] text-muted-foreground">1,520 BELo Score</div>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md">
                +18 Elo (Vừa Thắng)
              </div>
            </div>
          </AnimatedSection>

          {/* Card 2: Interactive Radar Maps */}
          <AnimatedSection className="md:col-span-1 lg:col-span-2 p-8 rounded-2xl border border-white/10 bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-sky-400 tracking-wider uppercase">Bản Đồ Thời Gian Thực</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black mt-1 mb-3">Tìm Sân Cầu Gần Bạn Tức Thì</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Định vị các sân đang mở, xem số slot trống trực tiếp và khoảng cách di chuyển từ vị trí của bạn.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">50+ sân liên kết TP.HCM</span>
              <span className="font-semibold text-primary">⚡ Mở đặt 24/7</span>
            </div>
          </AnimatedSection>

          {/* Card 3: Instant Booking */}
          <AnimatedSection className="md:col-span-1 lg:col-span-2 p-8 rounded-2xl border border-white/10 bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-orange-400 tracking-wider uppercase">Giữ Chỗ Nhanh Chóng</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black mt-1 mb-3">Đặt Slot & Thanh Toán Tự Động</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Tự động chia tiền sân theo người tham gia, thanh toán qua QR và gửi thông báo nhắc lịch chơi qua Mobile.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Xác nhận trong 3s</span>
              <span className="font-semibold text-emerald-400">✓ Không mất phí trung gian</span>
            </div>
          </AnimatedSection>

          {/* Card 4: Verified Community */}
          <AnimatedSection className="md:col-span-2 lg:col-span-2 p-8 rounded-2xl border border-white/10 bg-card hover:border-primary/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Văn Hoá Thể Thao Đích Thực</span>
              <h3 className="font-display text-2xl sm:text-3xl font-black mt-1 mb-3">Cộng Đồng Xác Thực & Đánh Giá</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Hệ thống đánh giá uy tín người chơi và chủ sân, cam kết môi trường giao lưu cầu lông văn minh, thân thiện.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50 border border-white/5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">99.2% đánh giá 5 sao</span>
              <span className="font-semibold text-primary">★ Fair-play Badge</span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ── Gallery Strip ──────────────────────────────────────────────────────── */

export function GalleryStrip() {
  return (
    <section className="py-14 bg-[#131822] border-y border-white/8 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-2xl font-black uppercase text-white tracking-tight">Khoảnh Khắc Sân Đấu</h3>
          <p className="text-xs text-slate-400">Hình ảnh các buổi giao lưu sôi nổi cùng ShuttleUp</p>
        </div>
        <Link href="/sessions" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          Xem tất cả trận <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <StaggerContainer
        className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 h-52 md:h-64"
        staggerDelay={0.1}
      >
        {galleryImages.map(({ src, alt }) => (
          <StaggerItem key={src}>
            <div className="relative rounded-2xl overflow-hidden h-full border border-white/10 group cursor-pointer">
              <Image
                src={src}
                alt={alt}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

/* ── CTA Banner ─────────────────────────────────────────────────────────── */

export function CtaBanner() {
  const t = useTranslations('HomePage.cta');
  
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="relative rounded-3xl bg-gradient-to-br from-[#181F2C] via-[#131822] to-[#0B0E14] border border-primary/30 p-10 md:p-16 text-center overflow-hidden shadow-2xl glow-gold-subtle">
          {/* Subtle Background Glow Circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/15 text-xs font-bold text-primary mb-6">
              🏸 THAM GIA MIỄN PHÍ HÔM NAY
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-5 leading-none">
              {t('title')}
            </h2>
            <p className="text-slate-300 mb-10 text-base sm:text-lg leading-relaxed font-normal">
              {t('subtitle')}
            </p>
            <Link href="/sessions">
              <Button
                size="lg"
                className="text-base px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/30 glow-gold cursor-pointer transition-transform duration-200 active:scale-95"
              >
                {t('button')}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

