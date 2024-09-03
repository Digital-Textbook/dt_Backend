import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/modules/subject/entities/subject.entity';

@Entity('bookmark')
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Notes for bookmark',
    example: 'Introduction of Physic',
  })
  @Column({
    comment: 'Notes of Bookmark',
  })
  notes: string;

  @ApiProperty({
    description: 'Last page access',
    example: '80',
  })
  @Column({
    comment: 'Page last access',
  })
  pages: string;

  @ApiProperty({
    description: 'Start time of the session',
    example: '2023-09-01T10:00:00Z',
  })
  @Column({ type: 'timestamp' })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the session',
    example: '2023-09-01T11:00:00Z',
  })
  @Column({ type: 'timestamp' })
  endTime: Date;

  @ApiProperty({ description: 'Time spent accessing the book in seconds' })
  @Column({
    type: 'bigint',
    comment: 'Total time used to access the book in seconds',
  })
  totalTime: bigint;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
