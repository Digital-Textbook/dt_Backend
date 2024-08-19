import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from '../../subject/entities/subject.entity';
import { ClassEnum } from '../dto/ClassEnum';

@Entity('class')
export class Class extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: 'This is the unique ID',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: ClassEnum,
    comment: 'Class of the user',
  })
  class: ClassEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Subject, (subject) => subject.class)
  subjects: Subject[];
}
