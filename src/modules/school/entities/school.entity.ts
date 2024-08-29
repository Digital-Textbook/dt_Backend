import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dzongkhag } from './dzongkhag.entity';

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
  @JoinColumn({ name: 'dzongkhagId' })
  dzongkhag: Dzongkhag;
}
