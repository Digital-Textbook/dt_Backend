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
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: UsersJwtPayload) {
    const { cidNo } = payload;
    const user = await this.userRepository.findOne({
      where: { cidNo },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token');
    }

    return user;
  }
}
