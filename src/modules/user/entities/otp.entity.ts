import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Admin } from 'src/modules/admin/entities/admin.entity';

@Entity('otp')
export class OtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({ type: 'varchar' })
  otp: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Users, (user) => user.otp)
  @JoinColumn()
  user: Users;
}
