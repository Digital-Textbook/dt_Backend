import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';

@Entity('permission')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Permission name must be Read, Write, Delete and etc',
    example: 'Read',
  })
  @Column({
    type: 'varchar',
  })
  permissionName: string;

  @ApiProperty({
    description: 'A brief description of the permission functionality',
    example: 'Allows reading data from the system',
  })
  @Column({
    type: 'varchar',
    length: 255,
  })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  roles: Role[];
}