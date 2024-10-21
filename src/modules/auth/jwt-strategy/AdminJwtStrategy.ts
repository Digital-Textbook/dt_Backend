import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { AdminJwtPayload } from './AdminJwtPayload.interface';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AdminJwtPayload) {
    try {
      const { email } = payload;
      const admin = await this.adminRepository.findOne({
        where: { email },
        relations: ['role', 'role.permissions'],
      });

      if (!admin) {
        throw new UnauthorizedException('Admin not found or invalid token');
      }

      return admin;
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
