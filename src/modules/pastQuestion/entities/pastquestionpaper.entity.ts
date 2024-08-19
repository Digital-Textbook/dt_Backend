import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { ClassEnum } from '../dto/ClassEnum';

@Entity('questionpapers')
export class PastQuestionPaper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'enum',
    enum: ClassEnum,
  })
  class: ClassEnum;

  @Column({ type: 'varchar' })
  subjectName: string;

  @Column({ type: 'varchar' })
  pastQuestion_url: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToOne(() => Subject, (subject) => subject.pastQuestionPaper)
  @JoinColumn()
  subject: Subject;
}
