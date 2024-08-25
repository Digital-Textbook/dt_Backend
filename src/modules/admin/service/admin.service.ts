import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../../admin/dto/createAdmin.dto';
import { UpdateAdminDto } from '../../admin/dto/updateAdmin.dto';
import { RoleType } from 'src/constants/role-type';
import { OtpEntity } from 'src/modules/user/entities/otp.entity';

import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AdminService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private readonly configService: ConfigService,
    private httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {}

  async getAllAdmin(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find({
        where: {
          roles: RoleType.ADMIN,
        },
      });
    } catch (error) {
      throw new Error('Error retrieving Admins from the database');
    }
  }

  async createNewAdmin(admin: CreateAdminDto) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: admin.email },
    });

    if (existingAdmin) {
      throw new ConflictException(
        `User with this Email already exists: ${admin.email}`,
      );
    }

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(admin.password, this.saltRounds);

      let newUser = this.adminRepository.create({
        ...admin,
        password: hashedPassword,
        status: 'active',
      });

      const savedUser = await this.adminRepository.save(newUser);
      return savedUser;
    } else {
      throw new NotFoundException(
        `No matching student data found for the provided CID No: ${admin.email}`,
      );
    }
  }

  async updateAdmin(id: string, adminData: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    if (adminData.password) {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      adminData.password = hashedPassword;
    }

    Object.assign(admin, adminData);

    return await this.adminRepository.save(admin);
  }

  async getAdminById(id: string): Promise<Admin> {
    if (!id) {
      throw new Error('ID is required');
    }

    const admin = await this.adminRepository.findOne({
      where: { id },
    });
    if (!admin) {
      throw new NotFoundException(`No matching data found with ID: ${id}`);
    }
    return admin;
  }

  async deleteAdminById(id: string): Promise<string> {
    if (!id) {
      throw new Error('ID is required');
    }

    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    await this.adminRepository.delete(id);

    return `Admin with id: ${id} successfully deleted`;
  }

  ///////////////////////////////////////////////////////////////////
  async forgotPasswordByEmail(email: string) {
    const admin = await this.adminRepository.findOne({
      where: { email: email, status: 'active' },
    });

    if (admin) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const existingUser = await this.adminRepository.findOne({
        where: {
          email: admin.email,
          status: 'active',
        },
      });
      let otpEntity = await this.otpRepository.findOne({
        where: {
          admin: { id: existingUser.id },
        },
      });

      if (otpEntity) {
        otpEntity.otp = otp;
        otpEntity.otpExpiresAt = otpExpiresAt;
        otpEntity.updatedAt = new Date(Date.now());
      } else {
        otpEntity = this.otpRepository.create({
          otp,
          otpExpiresAt,
          admin: existingUser,
        });
      }

      await this.otpRepository.save(otpEntity);

      await this.mailerService.sendMail({
        to: existingUser.email,
        subject: 'Your OTP Code',
        template: './otp',
        context: {
          otp,
          name: existingUser.name,
        },
      });

      return {
        msg: 'OTP successfully send',
        admin,
      };
    } else {
      throw new NotFoundException(
        'Admin is not verified with the provided email',
      );
    }
  }

  async resetPasswordByEmail(id: string, password: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException('User ID not found');
    }

    console.log('Password: ', password);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    admin.password = hashedPassword;

    console.log('Hashed: ', hashedPassword);

    await this.adminRepository.save(admin);

    return {
      msg: 'Password is updated for this user',
      admin,
    };
  }

  /////////////////////////////////////////////////////////////
  async verifyByEmail(id: string, otp: string): Promise<string> {
    const admin = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException('Admin ID not found');
    }

    const otpEntry = await this.otpRepository.findOne({
      where: {
        admin: { id: id },
      },
    });

    if (!otpEntry) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpEntry.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP has expired');
    }

    admin.status = 'active';
    await this.adminRepository.save(admin);

    await this.otpRepository.delete(otpEntry.id);

    return `OTP is verified.`;
  }
}
