import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from 'src/constants/role-type';
@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  mobile_no: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.ADMIN,
  })
  roles: RoleType;

  @Column({
    type: 'json',
  })
  permission: string[];

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
