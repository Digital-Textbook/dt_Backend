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
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AdminJwtPayload) {
    const { email } = payload;
    const existingAdmin = await this.adminRepository.findOne({
      where: { email },
      relations: ['role', 'role.permissions'],
    });

    if (!existingAdmin) {
      throw new UnauthorizedException('Admin not found or invalid token');
    }

    return existingAdmin;
  }
}
