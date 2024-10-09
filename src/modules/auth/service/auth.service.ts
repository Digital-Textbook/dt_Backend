import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../user/entities/users.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { LoginUserDto } from '../dto/loginUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersJwtPayload } from '../jwt-strategy/UsersJwtPayload.interface';
import { LoginAdminDto } from '../dto/admin-signin.dto';
import { AdminJwtPayload } from '../jwt-strategy/AdminJwtPayload.interface';
import { Status } from 'src/constants/status';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async SignIn(
    user: LoginUserDto,
  ): Promise<{ accessToken: string; user: Partial<Users> }> {
    const existingUser = await this.usersRepository.findOne({
      where: { cidNo: user.cidNo },
    });

    if (!existingUser) {
      throw new UnauthorizedException(
        `User with CID ${user.cidNo} does not exist`,
      );
    }

    if (existingUser.status === Status.INACTIVE) {
      throw new UnauthorizedException(
        'User is not verified. Please verify your account',
      );
    }

    if (existingUser.isLoggedIn === true) {
      throw new ConflictException('User already logged in to the system!');
    }

    const passwordMatches = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (passwordMatches) {
      const payload: UsersJwtPayload = { cidNo: existingUser.cidNo };
      const accessToken: string = await this.jwtService.sign(payload);

      existingUser.isLoggedIn = true;
      await this.usersRepository.save(existingUser);

      const { password, ...userData } = existingUser;

      return {
        accessToken,
        user: userData,
      };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async adminSignIn(admin: LoginAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: admin.email },
      relations: ['role', 'role.permissions'],
    });

    if (!existingAdmin) {
      throw new UnauthorizedException('Admin not found');
    }

    if (existingAdmin.isLoggedIn) {
      throw new ConflictException('Admin already logged in to the system!');
    }

    if (existingAdmin.status === 'inactive') {
      throw new UnauthorizedException('Please verify your account');
    }

    if (
      existingAdmin &&
      (await bcrypt.compare(admin.password, existingAdmin.password))
    ) {
      const adminPayload: AdminJwtPayload = {
        email: existingAdmin.email,
        role: existingAdmin.role.name,
        permissions: existingAdmin.role.permissions.map(
          (permission) => permission.permissionName,
        ),
      };

      //   console.log('Admin Payload::', adminPayload);
      const adminAccessToken: string = await this.jwtService.sign(
        adminPayload,
        {
          expiresIn: '1h',
        },
      );
      existingAdmin.isLoggedIn = true;
      await this.adminRepository.save(existingAdmin);
      return { adminAccessToken, existingAdmin };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  /////////////////////// User And Admin Log Out ////////////////////////////////////
  async userLogOut(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException(`User cannot log out`);
    }

    user.isLoggedIn = false;
    return await this.usersRepository.save(user);
  }

  async adminLogOut(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException('User not found. Please try again');
    }

    admin.isLoggedIn = false;
    return await this.adminRepository.save(admin);
  }

  async adminProfile(id: string) {
    const profile = await this.adminRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!profile) {
      throw new NotFoundException('Admin not found. Please try again!');
    }

    return profile;
  }
}
