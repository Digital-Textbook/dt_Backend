import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { CreateAdminDto } from '../../admin/dto/createAdmin.dto';
import { UpdateAdminDto } from '../../admin/dto/updateAdmin.dto';

import { MailerService } from '@nestjs-modules/mailer';
import { Admin } from '../entities/admin.entity';
import { AdminOtp } from '../entities/admin-otp.entity';
import { Role } from '../../role/entities/role.entity';

@Injectable()
export class AdminService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly mailerService: MailerService,
    @InjectRepository(AdminOtp) private otpRepository: Repository<AdminOtp>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async getAllAdmin() {
    try {
      return await this.adminRepository.find({
        select: ['id', 'name', 'email', 'status', 'mobileNo'],
        relations: ['role'],
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving Admins from the database',
      );
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
      const generatedPassword = crypto.randomBytes(5).toString('hex');

      const hashedPassword = await bcrypt.hash(
        generatedPassword,
        this.saltRounds,
      );

      let newUser = this.adminRepository.create({
        ...admin,
        password: hashedPassword,
        status: 'active',
      });

      await this.mailerService.sendMail({
        to: newUser.email,
        subject: 'Your Password',
        template: './admin',
        context: {
          generatedPassword,
          name: newUser.name,
        },
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
    const roleId = await this.roleRepository.findOne({
      where: { id: adminData.roleId },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    Object.assign(admin, adminData);
    admin.role = roleId;

    return await this.adminRepository.save(admin);
  }

  async getAdminById(id: string): Promise<Admin> {
    if (!id) {
      throw new Error('ID is required');
    }

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .select([
        'admin.id',
        'admin.name',
        'admin.email',
        'admin.mobileNo',
        'admin.status',
        'role.id',
        'role.role',
      ])
      .where('admin.id = :id', { id })
      .getOne();

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
      where: { email: email },
    });

    if (admin) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const hashedOtp = await bcrypt.hash(otp, 10);

      const existingUser = await this.adminRepository.findOne({
        where: {
          email: admin.email,
        },
      });
      let otpEntity = await this.otpRepository.findOne({
        where: {
          admin: { id: existingUser.id },
        },
      });

      if (otpEntity) {
        otpEntity.otp = hashedOtp;
        otpEntity.otpExpiresAt = otpExpiresAt;
        otpEntity.updatedAt = new Date(Date.now());
      } else {
        otpEntity = this.otpRepository.create({
          otp: hashedOtp,
          otpExpiresAt,
          admin: existingUser,
        });
      }

      await this.otpRepository.save(otpEntity);

      await this.mailerService.sendMail({
        to: existingUser.email,
        subject: 'Your OTP Code',
        template: './admin-otp',
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

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    admin.password = hashedPassword;
    admin.status = 'active';

    await this.adminRepository.save(admin);

    return {
      msg: 'Password is updated for this user',
      admin,
    };
  }

  /////////////////////////////////////////////////////////////
  async verifyByEmail(id: string, otp: string) {
    const admin = await this.adminRepository.findOne({
      where: { id: id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin ID ${id} not found`);
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

    const isOtpValid = await bcrypt.compare(otp, otpEntry.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    admin.status = 'active';
    await this.adminRepository.save(admin);

    return { msg: `OTP is verified.`, admin };
  }

  async deactivateAccount(id: string) {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin ID with ${id} not found!`);
    }

    admin.status = 'inactive';
    return await this.adminRepository.save(admin);
  }
}
