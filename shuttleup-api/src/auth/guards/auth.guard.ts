import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    try {
      const sessionData = await this.authService.auth.api.getSession({
        headers: request.headers
      });
      
      if (!sessionData) {
        throw new UnauthorizedException('Invalid or expired session');
      }
      
      request.user = sessionData.user;
      request.session = sessionData.session;
      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
