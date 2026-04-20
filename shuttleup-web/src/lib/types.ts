/**
 * Shared TypeScript types matching the NestJS/Prisma backend models.
 * Keep in sync with `shuttleup-api/prisma/schema.prisma`.
 */

// ── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  phone: string | null;
  skillLevel: SkillLevel;
  eloScore: number;
  role: "USER" | "ADMIN";
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "PRO";

// ── Court ───────────────────────────────────────────────────────────────────

export interface Court {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

// ── CourtSession ────────────────────────────────────────────────────────────

export interface CourtSession {
  id: string;
  hostId: string;
  courtId: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  totalSlots: number;
  availableSlots: number;
  pricePerSlot: number;
  skillRequired: SkillLevel | "ALL";
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  court?: Court;
  host?: Pick<User, "id" | "name" | "image">;
  bookings?: Booking[];
}

export type SessionStatus = "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";

// ── Booking ─────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  sessionId: string;
  userId: string | null;
  guestName: string | null;
  guestPhone: string | null;
  status: BookingStatus;
  amountPaid: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus =
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUNDED";
