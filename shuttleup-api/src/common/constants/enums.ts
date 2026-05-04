export enum SessionStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum SkillLevel {
  ALL = 'ALL',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum BookingStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  ATTENDED = 'ATTENDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum PaymentProvider {
  MOCK_VNPAY = 'MOCK_VNPAY',
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
}

// ==========================================
// ELO / BELo Ranking Enums
// ==========================================

export enum GameType {
  SINGLES = 'singles',
  DOUBLES = 'doubles',
  MIXED = 'mixed',
}

export enum MatchScore {
  TWO_ZERO = '2-0',
  TWO_ONE = '2-1',
}

export enum EloMatchStatus {
  CONFIRMED = 'CONFIRMED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

export enum TeamSide {
  TEAM_A = 'TEAM_A',
  TEAM_B = 'TEAM_B',
}
