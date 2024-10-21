import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/modules/user/entities/users.entity';
import { UsersJwtPayload } from './UsersJwtPayload.interface';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET, // he super method in PassportStrategy uses the secretOrKey to decode and validate the JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts the token from authorization headers
    });
  }

  async validate(payload: UsersJwtPayload) {
    try {
      const { id } = payload;
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found or invalid token');
      }

      return user;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Token has expired, please login again',
        );
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
