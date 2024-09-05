import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';

@Entity('screenTime')
export class ScreenTime extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Start time of the session',
    example: '2023-09-01T10:00:00Z',
  })
  @Column({ type: 'timestamp' })
  accessTime: Date;

  @ApiProperty({
    description: 'End time of the session',
    example: '2023-09-01T11:00:00Z',
  })
  @Column({ type: 'timestamp' })
  endTime: Date;

  @ApiProperty({ description: 'Time spent accessing the book in seconds' })
  @Column({
    type: 'int',
    comment: 'Total time used to access the book in seconds',
  })
  totalTime: number;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.screenTime)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Textbook, (textbook) => textbook.screenTime)
  @JoinColumn()
  textbook: Textbook;
}
