import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Class } from '../../class/entities/class.entity';
import { PastQuestionPaper } from '../../pastQuestion/entities/pastquestionpaper.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';

@Entity('subject')
export class Subject extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({
    comment: 'Subject name of each class',
  })
  subjectName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Class, (classEntity) => classEntity.subjects)
  class: Class;

  @OneToMany(() => PastQuestionPaper, (question) => question.subject)
  question: PastQuestionPaper;

  @OneToMany(() => Textbook, (textbooks) => textbooks.subject)
  textbooks: Textbook;
}
