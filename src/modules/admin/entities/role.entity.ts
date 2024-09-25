import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Role can be ADMIN, SUPER ADMIN and etc',
    example: 'ADMIN',
  })
  @Column({
    type: 'varchar',
  })
  role: string;
}
