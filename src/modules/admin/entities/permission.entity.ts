import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

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
}