import { Controller, All, Post, Get, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Email / Password ──────────────────────────────────────────────────────

  @Post('sign-in/email')
  @Public()
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        rememberMe: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful, returns session token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  @Post('sign-up/email')
  @Public()
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123', minLength: 8 },
        name: { type: 'string', example: 'Nguyen Van A' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Registration successful' })
  @ApiResponse({ status: 422, description: 'Email already in use' })
  async signUp(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  @Post('sign-out')
  @Public()
  @ApiOperation({ summary: 'Logout and invalidate current session' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  async signOut(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  // ── Session ───────────────────────────────────────────────────────────────

  @Get('get-session')
  @Public()
  @ApiOperation({ summary: 'Get current active session and user info' })
  @ApiResponse({ status: 200, description: 'Session data or null if not authenticated' })
  async getSession(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  // ── Anonymous (Guest Booking) ──────────────────────────────────────────────

  @Post('sign-in/anonymous')
  @Public()
  @ApiOperation({
    summary: 'Create anonymous guest session',
    description: 'Used for guest court bookings without requiring a full account. Can be upgraded to a full account later.',
  })
  @ApiResponse({ status: 200, description: 'Anonymous session created' })
  async signInAnonymous(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  // ── Password Reset ────────────────────────────────────────────────────────

  @Post('forget-password')
  @Public()
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        redirectTo: { type: 'string', example: 'http://localhost:3001/reset-password' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Reset email sent (check server logs in dev)' })
  async forgetPassword(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Reset password with token from email' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'newPassword'],
      properties: {
        token: { type: 'string' },
        newPassword: { type: 'string', minLength: 8 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  async resetPassword(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }

  // ── Catch-all for internal Better Auth routes ──────────────────────────────
  // Handles: /api/auth/callback/*, /api/auth/verify-email, etc.
  @All('*path')
  @Public()
  async handleAll(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(this.authService.auth)(req, res);
  }
}
