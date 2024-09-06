import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Dzongkhag } from './dzongkhag.entity';
import { UserProfile } from 'src/modules/user/entities/UserProfile.entity';

@Entity('school')
export class School extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    comment: 'Subject name of each class',
  })
  schoolName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Dzongkhag, (dzongkhag) => dzongkhag.school)
  @JoinColumn()
  dzongkhag: Dzongkhag;

  @OneToMany(() => UserProfile, (userProfile) => userProfile.school)
  userProfile: UserProfile;
}
