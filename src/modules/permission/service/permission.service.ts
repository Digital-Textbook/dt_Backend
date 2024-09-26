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
    return await this.permissionRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.roles', 'role')
      .select([
        'permission.id',
        'permission.permissionName',
        'permission.description',
        'permission.createdAt',
        'role.id',
        'role.role',
      ])
      .getMany();
  }

  async getPermissionById(id: string) {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      select: ['id', 'permissionName', 'description'],
      relations: ['roles'],
    });
    if (!permission) {
      throw new NotFoundException(`Permission not found based on ID:: ${id}`);
    }

    return permission;
  }
}
