import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Class } from '../../class/entities/class.entity';
import { PastQuestionPaper } from '../../pastQuestion/entities/pastquestionpaper.entity';

@Entity('subject')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'This is the unique ID',
  })
  id: number;

  @Column({
    comment: 'Subject name of each class',
  })
  subject: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Class, (classEntity) => classEntity.subjects)
  class: Class;

  @OneToOne(
    () => PastQuestionPaper,
    (pastQuestionPaper) => pastQuestionPaper.subject,
  )
  @JoinColumn()
  pastQuestionPaper: PastQuestionPaper;
}
