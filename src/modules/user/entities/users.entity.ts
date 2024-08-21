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

@Entity('users')
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  cid_no: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  student_code: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  mobile_no: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  user_type: 'bhutanese' | 'non-bhutanese';

  @Column({ type: 'varchar' })
  status: 'active' | 'inactive';

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

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
