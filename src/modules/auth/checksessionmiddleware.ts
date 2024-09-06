import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Users } from '../user/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CheckSessionMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = this.jwtService.verify(token);

        const user = await this.usersRepository.findOne({
          where: { cidNo: decoded.cidNo },
        });

        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        const isTokenExpired = decoded.exp < Date.now() / 1000;
        if (isTokenExpired && user.isLoggedIn) {
          user.isLoggedIn = false;
          await this.usersRepository.save(user);
        }
      } catch (err) {
        throw new UnauthorizedException('Session expired');
      }
    }
    next();
  }
}
