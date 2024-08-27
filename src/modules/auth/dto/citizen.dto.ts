import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/constants/gender';

export class CitizenDto {
  @ApiProperty({ type: String })
  cidNo!: string;

  @ApiProperty({ type: String, required: false })
  passportNo?: string;

  @ApiProperty({ type: String })
  name!: string;

  @ApiProperty({ type: Date })
  dateOfBirth!: Date;

  @ApiProperty({ enum: Gender })
  gender!: Gender;

  @ApiProperty({ type: String, required: false })
  contactNo?: string;

  @ApiProperty({ type: String, required: false })
  createdById?: string;

  @ApiProperty({ type: String, required: false })
  createdByName?: string;

  @ApiProperty({ type: String, required: false })
  updatedById?: string;

  @ApiProperty({ type: String, required: false })
  updatedByName?: string;
}
