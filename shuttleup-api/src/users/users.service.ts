import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubmitOnboardingDto } from './dto/submit-onboarding.dto';

// ── Weighted Scoring Tables ────────────────────────────────────────────────
// Index → bonus ELO points. Must match frontend wizard-questions.ts exactly.

const ONBOARDING_WEIGHTS = {
  experience: [0, 50, 100, 150, 200], // max +200
  frequency: [0, 30, 60, 80], // max +80
  tournament: [0, 50, 100, 150], // max +150
  gameStyle: [0, 30, 50], // max +50
  technique: [0, 30, 60, 80], // max +80
  training: [0, 15, 40, 60], // max +60
  selfRating: [0, 30, 60, 90, 120], // max +120
} as const; // TOTAL max: 740

const BASE_ELO = 1200;

function calculateWeightedElo(
  answers: Record<string, number>,
): number {
  let bonus = 0;
  for (const [key, index] of Object.entries(answers)) {
    const table =
      ONBOARDING_WEIGHTS[key as keyof typeof ONBOARDING_WEIGHTS];
    if (table && index >= 0 && index < table.length) {
      bonus += table[index];
    }
  }
  return BASE_ELO + bonus; // Range: 1200–1940
}

function deriveSkillLevel(elo: number): string {
  if (elo >= 1700) return 'PRO';
  if (elo >= 1400) return 'ADVANCED';
  if (elo >= 1100) return 'INTERMEDIATE';
  return 'BEGINNER';
}

// ── Service ────────────────────────────────────────────────────────────────

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        skillLevel: true,
        eloScore: true,
        role: true,
        onboardingCompleted: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        skillLevel: true,
        eloScore: true,
        role: true,
        onboardingCompleted: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateElo(id: string, newElo: number) {
    return this.prisma.user.update({
      where: { id },
      data: { eloScore: newElo },
    });
  }

  // ── Onboarding Questionnaire ───────────────────────────────────────────

  async submitOnboarding(userId: string, dto: SubmitOnboardingDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, onboardingCompleted: true },
    });

    if (!user) throw new NotFoundException('User not found');
    if (user.onboardingCompleted) {
      throw new BadRequestException('Onboarding already completed');
    }

    const newElo = calculateWeightedElo(dto.answers as unknown as Record<string, number>);
    const skillLevel = deriveSkillLevel(newElo);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        eloScore: newElo,
        skillLevel,
        onboardingCompleted: true,
        onboardingAnswers: dto.answers as unknown as Record<string, number>,
      },
      select: {
        eloScore: true,
        skillLevel: true,
        onboardingCompleted: true,
      },
    });
  }
}
