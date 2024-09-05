import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserProfile } from './UserProfile.entity';
import { OtpEntity } from './otp.entity';
import { ApiProperty } from '@nestjs/swagger';
import { userType } from 'src/constants/user-type';
import { Status } from 'src/constants/status';
import { Bookmark } from 'src/modules/bookmark/entities/bookmark.entities';
import { ScreenTime } from 'src/modules/bookmark/entities/screen-time.entities';

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
    length: 50,
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
  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
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
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmark: Bookmark;

  @OneToMany(() => ScreenTime, (screenTime) => screenTime.user)
  screenTime: ScreenTime;
}
