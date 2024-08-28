import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/constants/gender';
import { ClassEnum } from 'src/constants/class-enum';

@Entity('user_profile')
export class UserProfile extends BaseEntity {
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
    length: 20,
  })
  studentCode: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 20,
  })
  mobileNo: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @ApiProperty({
    description: 'Class is required',
    example: '12',
  })
  @Column({
    type: 'enum',
    enum: ClassEnum,
    comment: 'Class is required',
  })
  class: ClassEnum;

  @Column({
    type: 'varchar',
    length: 255,
  })
  schoolId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

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

  @OneToOne(() => Users, (user) => user.profile)
  @JoinColumn()
  user: Users;
}
