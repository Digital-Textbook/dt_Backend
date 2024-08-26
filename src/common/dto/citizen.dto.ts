import { ApiProperty } from '@nestjs/swagger';

// import { AbstractDto } from '../../../common/dto/abstract.dto';
// import { Gender } from '../../../constants';
// import { type CitizenEntity } from '../citizen.entity';
import { Gender } from 'src/constants/gender';
import { BaseEntity } from 'typeorm';

export class CitizenDto extends BaseEntity {
  @ApiProperty({ type: String })
  cidNo!: string;

  @ApiProperty({ type: String })
  passportNo!: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: Date })
  dateOfBirth!: Date;

  @ApiProperty({ type: 'enum', enum: Gender })
  gender!: Gender;

  @ApiProperty({ type: String })
  contactNo!: string;

  @ApiProperty({ type: String })
  createdById!: string;

  @ApiProperty({ type: String })
  createdByName!: string;

  @ApiProperty({ type: String })
  updatedById!: string;

  @ApiProperty({ type: String })
  updatedByName!: string;

  //   constructor(entityName: CitizenEntity) {
  //     super(entityName);
  //     this.cidNo = entityName.cidNo;
  //     this.passportNo = entityName.passportNo;
  //     this.name = entityName.name;
  //     this.dateOfBirth = entityName.dateOfBirth;
  //     this.gender = entityName.gender;
  //     this.contactNo = entityName.contactNo;
  //     this.createdById = entityName.createdById;
  //     this.createdByName = entityName.createdByName;
  //     this.updatedById = entityName.updatedById;
  //     this.updatedByName = entityName.updatedByName;
  //   }
}
