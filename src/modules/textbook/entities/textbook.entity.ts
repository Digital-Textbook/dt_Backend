import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { Bookmark } from 'src/modules/bookmark/entities/bookmark.entities';
import { ScreenTime } from 'src/modules/bookmark/entities/screen-time.entities';

@Entity('textbook')
export class Textbook extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Name of author',
    example: 'Tshering Dawa',
  })
  @Column({
    comment: 'Author of book',
  })
  author: string;

  @ApiProperty({
    description: 'Number of chapter',
    example: '12',
  })
  @Column({
    comment: 'Total number of chapter in textbook',
  })
  chapter: string;

  @ApiProperty({
    description: 'Total number of pages',
    example: '286',
  })
  @Column({
    comment: 'Total number of pages in textbook',
  })
  totalPages: string;

  @ApiProperty({
    description: 'Total number of pages',
    example: 'Introduction or Importance of History',
  })
  @Column({
    comment: 'Summary of textbook',
  })
  summary: string;

  @ApiProperty({
    description: 'Number of edition',
    example: 'First edition',
  })
  @Column({
    comment: 'Number of edition',
  })
  edition: string;

  @ApiProperty({
    description: 'Textbook url',
    example: 'localhost:9000/dt-backend/226d79a3340c4a1054c2f25823ceb5f3.png',
  })
  @Column({
    comment: 'Address of cover page',
  })
  coverUrl: string;

  @ApiProperty({
    description: 'Textbook url',
    example: 'localhost:9000/dt-backend/226d79a3340c4a1054c2f25823ceb5f3.pdf',
  })
  @Column({
    comment: 'Address of textbook in pdf or epub',
  })
  textbookUrl: string;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Subject, (subjects) => subjects.textbooks)
  @JoinColumn()
  subject: Subject;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.textbook)
  bookmark: Bookmark;

  @OneToMany(() => ScreenTime, (screenTime) => screenTime.textbook)
  screenTime: ScreenTime;
}
