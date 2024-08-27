import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../user/entities/users.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { LoginUserDto } from '../dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { LoginAdminDto } from '../dto/admin-signin.dto';
import { AdminJwtPayload } from '../dto/admin-jwt-payload.interface';
import { Status } from 'src/constants/status';

@Injectable()
export class AuthService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async SignIn(user: LoginUserDto): Promise<{ accessToken: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: { cidNo: user.cidNo },
    });

    console.log('User: ', existingUser);

    if (!existingUser) {
      throw new UnauthorizedException(
        `User with CID ${user.cidNo} does not exist`,
      );
    }

    if (existingUser.status === Status.INACTIVE) {
      throw new UnauthorizedException('Please verify your account');
    }

    if (
      existingUser &&
      (await bcrypt.compare(user.password, existingUser.password))
    ) {
      const payload: JwtPayload = { cidNo: existingUser.cidNo };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async adminSignIn(
    admin: LoginAdminDto,
  ): Promise<{ adminAccessToken: string }> {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: admin.email },
    });

    if (
      existingAdmin &&
      (await bcrypt.compare(admin.password, existingAdmin.password))
    ) {
      const adminPayload: AdminJwtPayload = { email: existingAdmin.email };
      const adminAccessToken: string = await this.jwtService.sign(adminPayload);
      return { adminAccessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
