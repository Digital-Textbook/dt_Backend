import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';

@Entity('bookmark')
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Last page access',
    example: '80',
  })
  @Column({
    comment: 'Page last access',
  })
  pageNumber: string;

  @ApiProperty({
    description: 'Thumb nail for bookmark',
    example: true,
  })
  @Column({
    default: false,
  })
  isBookmark: boolean;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.bookmark)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Textbook, (textbook) => textbook.bookmark)
  @JoinColumn()
  textbook: Textbook;
}
