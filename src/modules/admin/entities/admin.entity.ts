import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from 'src/modules/role/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AdminOtp } from './admin-otp.entity';

@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  mobileNo: string;

  @ApiProperty({
    description: 'Status must be inactive',
    example: 'inactive',
  })
  @Column({ type: 'varchar' })
  status: 'active' | 'inactive';

  @Column({
    type: 'varchar',
  })
  password: string;

  @ApiProperty({ description: 'Is Logged In' })
  @Column({ type: 'boolean', default: false })
  isLoggedIn: boolean;

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

  @OneToOne(() => AdminOtp, (adminOtp) => adminOtp.admin)
  adminOtp: AdminOtp;

  @ManyToOne(() => Role, (role) => role.admins)
  role: Role;
}
