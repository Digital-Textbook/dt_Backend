import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); // This is essential to read the authorization header from the incoming request.
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token not found');
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'topSecret51', // pass secret directly
      });

      if (!user || !user.id) {
        throw new UnauthorizedException('Invalid token or user not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      console.error('Token verification error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
