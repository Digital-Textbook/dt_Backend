import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../../role/entities/role.entity';
import { CreateRoleDto } from '../../role/dto/createRole.dto';
import { UpdateRoleDto } from '../../role/dto/updateRole.dto';
import { Permission } from 'src/modules/permission/entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createRole: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRole);
    return await this.roleRepository.save(role);
  }

  async update(id: string, roleData: UpdateRoleDto): Promise<Role> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id },
    });
    if (!roleEntity) {
      throw new NotFoundException('Role not found!');
    }

    console.log('Update Role::', roleData.role);
    console.log('Update ID::', id);
    await this.roleRepository.update(id, roleData);
    return this.roleRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async deleteRole(id: string) {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role Id not found!');
    }

    return { msg: 'Role deleted successfully1' };
  }

  async addPermissionToRole(roleId: string, permissionId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId },
    });

    if (!role || !permission) {
      throw new Error('Role or Permission not found');
    }

    role.permissions.push(permission);
    return await role.save();
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Filter out the permission to be removed
    role.permissions = role.permissions.filter(
      (permission) => permission.id !== permissionId,
    );

    return await this.roleRepository.save(role);
  }
}
