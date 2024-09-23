import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
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
  pastQuestionUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Subject, (subject) => subject.question, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subject: Subject;
}
