import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/session.dto';
import { SearchSessionDto } from './dto/search-session.dto';
import { Prisma } from '@prisma/client';
import { SessionStatus, SkillLevel } from '../common/constants/enums';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async create(hostId: string, data: CreateSessionDto) {
    return this.prisma.courtSession.create({
      data: {
        hostId,
        courtId: data.courtId,
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        totalSlots: data.totalSlots,
        availableSlots: data.totalSlots,
        pricePerSlot: data.pricePerSlot,
        skillRequired: (data.skillRequired as SkillLevel) || SkillLevel.ALL,
        status: SessionStatus.OPEN,
      },
    });
  }

  async findAll() {
    return this.prisma.courtSession.findMany({
      include: {
        court: true,
        host: { select: { id: true, name: true, eloScore: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.courtSession.findUnique({
      where: { id },
      include: {
        court: true,
        host: { select: { id: true, name: true, eloScore: true } },
        bookings: {
          select: {
            id: true,
            status: true,
            guestName: true,
            user: { select: { name: true, eloScore: true } },
          },
        },
      },
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async searchNearby(query: SearchSessionDto) {
    if (query.lat && query.lng) {
      const radius = query.radiusMm || 5000;

      const skillFilter = query.skillRequired
        ? Prisma.sql`AND s."skillRequired" = ${query.skillRequired}`
        : Prisma.empty;

      const priceFilter = query.priceMax
        ? Prisma.sql`AND s."pricePerSlot" <= ${query.priceMax}`
        : Prisma.empty;

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;

      return this.prisma.$queryRaw`
        SELECT s.id, s.title, s."startTime", s."endTime", s."pricePerSlot", s.status, s."availableSlots",
               c.name as "courtName", c.address, c.lat, c.lng,
               ST_Distance(c.geometry::geography, ST_SetSRID(ST_MakePoint(${query.lng}, ${query.lat}), 4326)::geography) as distance
        FROM court_sessions s
        JOIN courts c ON s."courtId" = c.id
        WHERE ST_DWithin(
          c.geometry::geography,
          ST_SetSRID(ST_MakePoint(${query.lng}, ${query.lat}), 4326)::geography,
          ${radius}
        )
        AND s.status = 'OPEN'
        ${skillFilter}
        ${priceFilter}
        ORDER BY distance ASC
        LIMIT ${limit} OFFSET ${(page - 1) * limit};
      `;
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return this.prisma.courtSession.findMany({
      where: {
        status: SessionStatus.OPEN,
        ...(query.district && { court: { district: query.district } }),
        ...(query.skillRequired && { skillRequired: query.skillRequired }),
        ...(query.priceMax && { pricePerSlot: { lte: query.priceMax } }),
      },
      include: {
        court: true,
        host: { select: { id: true, name: true, eloScore: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startTime: 'asc' },
    });
  }
}
