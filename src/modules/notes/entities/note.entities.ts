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

@Entity('notes')
export class Notes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Last page access',
    example: '80',
  })
  @Column({
    comment: 'Page number',
  })
  pageNumber: string;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User notes on the textbook',
    example: 'This is a note about the current page.',
  })
  @Column({
    type: 'text',
    nullable: true,
    comment: 'User notes',
  })
  notes: string;

  @ManyToOne(() => Users, (user) => user.notes, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Textbook, (textbook) => textbook.notes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  textbook: Textbook;
}
