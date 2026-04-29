import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Auth, betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { anonymous } from 'better-auth/plugins';

@Injectable()
export class AuthService {
  public auth: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const secret = this.configService.get<string>('auth.secret');
    const baseURL = this.configService.get<string>('auth.url');
    const corsOrigins = this.configService.get<string[]>('app.corsOrigin') ?? [
      'http://localhost:3001',
    ];
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const isProd = nodeEnv === 'production';

    this.auth = betterAuth({
      secret,
      baseURL,

      // ── CORS / Trusted Origins ──────────────────────────────────────────────
      trustedOrigins: corsOrigins,

      // ── Database ───────────────────────────────────────────────────────────
      database: prismaAdapter(this.prisma, {
        provider: 'postgresql',
      }),

      advanced: {
        disableCSRFCheck: !isProd, // Disabled in dev so Postman/cURL work easily
      },

      // ── Email & Password ───────────────────────────────────────────────────
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: true,
        sendResetPasswordToken: ({ user, url }) => {
          if (isProd) {
            // TODO: wire real email service (Resend/SendGrid) for production
            console.warn(
              `[AUTH] sendResetPasswordToken not wired for production yet`,
            );
          } else {
            // Dev: log the link to console so we can test the flow
            console.log(
              `[DEV] Password reset link for ${(user as { email: string }).email}:`,
            );
            console.log(`  → ${url}`);
          }
        },
      },

      // ── Session ───────────────────────────────────────────────────────────
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Refresh session cookie every 24h
        cookieCache: {
          enabled: false, // Disabled in dev — enable in prod to reduce DB hits
        },
      },

      // ── Rate Limiting ─────────────────────────────────────────────────────
      rateLimit: {
        enabled: false,
        window: 60, // 60 second window
        max: 20, // 20 requests per window (relax for dev)
        storage: 'memory', // Switch to 'database' for multi-instance prod
      },

      // ── User extra fields ─────────────────────────────────────────────────
      user: {
        additionalFields: {
          phone: { type: 'string', required: false }, // Optional at sign-up, fill in profile
          skillLevel: {
            type: 'string',
            required: false,
            defaultValue: 'BEGINNER',
          },
          eloScore: { type: 'number', required: false, defaultValue: 1200 },
          role: { type: 'string', required: false, defaultValue: 'USER' },
        },
      },

      // ── Plugins ───────────────────────────────────────────────────────────
      plugins: [
        anonymous(), // Guest sessions for unauthenticated bookings
      ],
    });
  }
}
