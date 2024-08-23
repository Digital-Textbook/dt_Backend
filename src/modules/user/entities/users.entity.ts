import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserProfile } from './UserProfile.entity';
import { Exclude } from 'class-transformer';
import { OtpEntity } from './otp.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Name must be string',
    example: 'Tenzin Norbu',
  })
  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @ApiProperty({
    description: 'CID is required',
    example: '11807009876',
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  cid_no: string;

  @ApiProperty({
    description: 'Student code must follow this format: 201.00345.33.0006',
    example: '201.00345.33.0006',
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  student_code: string;

  @ApiProperty({
    description: 'Phone number is required',
    example: '17654321',
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  mobile_no: string;

  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'User type must be bhutanese or non-bhutanese',
    example: 'bhutanese',
  })
  @Column({ type: 'varchar' })
  user_type: 'bhutanese' | 'non-bhutanese';

  @ApiProperty({
    description: 'Status must be inactive',
    example: 'inactive',
  })
  @Column({ type: 'varchar' })
  status: 'active' | 'inactive';

  @ApiProperty({
    description: 'Password is required',
    example: 'Password#76',
  })
  @Column({
    type: 'varchar',
  })
  password: string;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  @JoinColumn({ name: 'profileId' })
  @Exclude({ toPlainOnly: true })
  profile: UserProfile;
}
