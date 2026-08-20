import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourtDto } from './dto/court.dto';

@Injectable()
export class CourtsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourtDto) {
    return this.prisma.court.create({ data });
  }

  async findAll() {
    return this.prisma.court.findMany();
  }

  async findOne(id: string) {
    return this.prisma.court.findUnique({
      where: { id },
      include: { sessions: true },
    });
  }

  async findNearby(lat: number, lng: number, _radiusKm: number = 5) {
    // For now, returning all courts (SearchModule handles advanced PostGIS)
    return this.prisma.court.findMany();
  }
}
