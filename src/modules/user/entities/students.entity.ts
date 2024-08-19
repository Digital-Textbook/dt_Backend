import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassEnum } from 'src/constants/class-enum';

@Entity('students')
export class Students extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  cid_no: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  student_code: string;

  @Column({
    type: 'enum',
    enum: ClassEnum,
    comment: 'Class of the student',
  })
  class: ClassEnum;

  @Column({ type: 'varchar', length: 255 })
  school: string;

  @Column({ type: 'varchar', length: 255 })
  dzongkhag: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
