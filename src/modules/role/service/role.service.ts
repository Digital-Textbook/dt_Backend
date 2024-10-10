import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { In } from 'typeorm';

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

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async getRoleById(id: string) {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found!`);
    }

    return role;
  }

  async deleteRole(id: string) {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role Id not found!');
    }

    return { msg: 'Role deleted successfully1' };
  }

  async getRoleForPermission(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found!`);
    }
    return role;
  }

  async updateRolePermissions(
    id: string,
    permissionIds: string[],
    roleData: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    console.log('Role Data::', roleData);

    if (roleData && (roleData.name || roleData.description)) {
      Object.assign(role, roleData);
    }

    const newPermissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (newPermissions.length !== permissionIds.length) {
      const notFoundIds = permissionIds.filter(
        (id) => !newPermissions.some((permission) => permission.id === id),
      );
      throw new NotFoundException(
        `Permissions not found for IDs: ${notFoundIds.join(', ')}`,
      );
    }

    role.permissions = newPermissions;

    return await this.roleRepository.save(role);
  }
}
