import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { School } from './school.entity';

@Entity('dzongkhag')
export class Dzongkhag extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @ApiProperty({
    description: 'Name of dzongkhag is required!',
    example: 'Thimphu',
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @ApiProperty({ description: 'Created date' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => School, (school) => school.dzongkhag)
  school: School[];
}
