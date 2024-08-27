import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from 'src/constants/gender';

@Entity({ name: 'citizens' })
export class CitizenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'This is the unique ID',
  })
  id: string;

  @Column({ nullable: false })
  cidNo!: string;

  @Column({ nullable: true })
  passportNo?: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: false })
  dateOfBirth!: Date;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ nullable: true })
  contactNo?: string;

  @Column({ nullable: true })
  createdById?: string;

  @Column({ nullable: true })
  createdByName?: string;

  @Column({ nullable: true })
  updatedById?: string;

  @Column({ nullable: true })
  updatedByName?: string;
}
