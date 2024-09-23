import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';
import { School } from 'src/modules/school/entities/school.entity';

@Entity('userProfile')
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Name is required',
    example: 'John Doe',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @ApiProperty({
    description: 'Student code must match the pattern 201.00345.33.0042',
    example: '201.00345.33.0042',
  })
  @Column({
    type: 'varchar',
    unique: true,
    length: 20,
  })
  studentCode: string;

  @ApiProperty({
    description: 'Mobile number is required',
    example: '17542312',
  })
  @Column({
    type: 'varchar',
    unique: true,
    length: 20,
  })
  mobileNo: string;

  @ApiProperty({
    description: 'Class is required',
    example: '12',
  })
  @Column()
  class: string;

  @ApiProperty({
    description: 'Gender must be MALE or FEMALE',
    example: 'MALE',
  })
  @Column()
  gender: string;

  @ApiProperty({
    description: 'Date of Birth, can be null',
    example: '1990-01-01',
    nullable: true,
  })
  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @ApiProperty({
    description: 'Profile Iamge Url',
    example: 'localhost:9000/dt-backend/226d79a3340c4a1054c2f25823ceb5f3.png',
  })
  @Column({
    comment: 'Address of profile image',
    nullable: true,
  })
  profileImageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Users, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Dzongkhag, (dzongkhag) => dzongkhag.userProfile)
  @JoinColumn()
  dzongkhag: Dzongkhag;

  @ManyToOne(() => School, (school) => school.userProfile)
  @JoinColumn()
  school: School;
}
