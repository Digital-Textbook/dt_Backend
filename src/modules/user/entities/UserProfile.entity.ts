import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { Users } from './users.entity';

@Entity('user_profile')
export class UserProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
  })
  student_code: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 255,
  })
  mobile_no: string;

  @Column({
    type: 'varchar',
  })
  class: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  school: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  dzongkhag: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToOne(() => Users, (user) => user.profile)
  user: Users;
}
