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
import { userType } from 'src/constants/user-type';
import { Gender } from 'src/constants/gender';
import { Status } from 'src/constants/status';

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
  cidNo: string;

  @ApiProperty({
    description: 'Phone number is required',
    example: '17654321',
  })
  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  mobileNo: string;

  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @ApiProperty({
    description:
      'User type must be bhutanese with cid, bhutanese with permit or non-bhutanese',
    example: 'bhutanese_with_cid',
  })
  @Column({
    type: 'enum',
    enum: userType,
    comment: 'User type',
  })
  userType: userType;

  @ApiProperty({
    description: 'Gender must be MALE or FEMALE',
    example: 'MALE',
  })
  @Column({
    type: 'enum',
    enum: Gender,
    comment: 'Gender must be MALE or FEMALE',
  })
  gender: Gender;

  @ApiProperty({
    description: 'Date of Birth, can be null',
    example: '1990-01-01',
    nullable: true,
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @ApiProperty({
    description: 'Status must be inactive',
    example: 'inactive',
  })
  @Column({
    type: 'enum',
    enum: Status,
    comment: 'Status must required',
  })
  status: Status;

  @ApiProperty({
    description: 'Password is required',
    example: 'Password#76',
  })
  @Column({
    type: 'varchar',
    nullable: true,
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

  //   @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  //   @JoinColumn({ name: 'profileId' })
  //   @Exclude({ toPlainOnly: true })
  //   profile: UserProfile;
}
