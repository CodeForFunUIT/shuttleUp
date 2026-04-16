import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { anonymous } from 'better-auth/plugins';

@Injectable()
export class AuthService {
  public auth;

  constructor(private readonly prisma: PrismaService) {
    this.auth = betterAuth({
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),
      emailAndPassword: {
        enabled: true,
      },
      plugins: [
        anonymous() // Allows creating anonymous sessions for guest users
      ],
      user: {
        additionalFields: {
          phone: { type: 'string', required: true },
          skillLevel: { type: 'string', required: false, defaultValue: 'BEGINNER' },
          eloScore: { type: 'number', required: false, defaultValue: 1200 },
          role: { type: 'string', required: false, defaultValue: 'USER' },
        }
      }
    });
  }
}
