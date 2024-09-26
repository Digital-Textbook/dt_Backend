import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/createPermission.dto';
import { UpdatePermissionDto } from '../dto/updatePermission.dto';
import { Role } from '../../role/entities/role.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async update(
    id: string,
    permissionData: UpdatePermissionDto,
  ): Promise<Permission> {
    const permissionEntity = await this.permissionRepository.findOne({
      where: { id },
    });
    if (!permissionEntity) {
      throw new NotFoundException('Permission not found!');
    }

    console.log('Update permission::', permissionData.permissionName);
    console.log('Update ID::', id);
    await this.permissionRepository.update(id, permissionData);
    return this.permissionRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Permission[]> {
    const permission = await this.permissionRepository.find();
    if (!permission || permission.length === 0) {
      throw new NotFoundException('Permission not found in database!');
    }
    return permission;
  }

  async deletePermission(id: string) {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Permission Id not found!');
    }

    return { msg: 'Pemission deleted successfully1' };
  }

  async getPermissionsWithRoles() {
    return await this.permissionRepository.find({ relations: ['roles'] });
  }
}
