import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
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
  mobileNo: string;

  @ManyToOne(() => Role, { eager: true })
  @ApiProperty({
    description: 'Role assigned to the admin',
    example: 'ADMIN',
  })
  role: Role;

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
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToOne(() => AdminOtp, (adminOtp) => adminOtp.admin)
  adminOtp: AdminOtp;
}
