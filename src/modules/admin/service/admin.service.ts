import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { CreateAdminDto } from '../../admin/dto/createAdmin.dto';
import { UpdateAdminDto } from '../../admin/dto/updateAdmin.dto';
import { RoleType } from 'src/constants/role-type';

@Injectable()
export class AdminService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
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
}
