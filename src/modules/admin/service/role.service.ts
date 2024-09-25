import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/createRole.dto';
import { UpdateRoleDto } from '../dto/updateRole.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
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
}
