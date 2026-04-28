import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow @Public() routes through without auth check
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: unknown; session?: unknown }>();

    try {
      const sessionData = await this.authService.auth.api.getSession({
        headers: request.headers as unknown as HeadersInit,
      });

      if (!sessionData) {
        throw new UnauthorizedException('Invalid or expired session');
      }

      request.user = sessionData.user;
      request.session = sessionData.session;

      return true;
    } catch {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
