import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { StudentProfile } from './studentProfile.entity';

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

  @Column({ type: 'varchar' })
  user_type: 'bhutanese' | 'non-bhutanese';

  @Column({ type: 'varchar' })
  status: 'active' | 'incative';

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

  @OneToOne(() => StudentProfile, (profile) => profile.user, { cascade: true })
  @JoinColumn({ name: 'profileId' })
  profile: StudentProfile;
}
