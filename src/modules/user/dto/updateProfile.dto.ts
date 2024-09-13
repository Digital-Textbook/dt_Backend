import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Name is required!',
    example: 'Tshering',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Student code is required!',
    example: '201.00345.33.0042',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Student code must follow this format: 201.00345.33.0042',
  })
  studentCode: string;

  @ApiProperty({
    description: 'Mobile Number is required!',
    example: '17654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mobile number must be string' })
  mobileNo: string;

  @ApiProperty({
    description: 'Class is required!',
    example: '10',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Class must be a string' })
  class: string;

  @ApiProperty({
    description: 'User gender must be Male or Female',
    example: 'Male',
    required: false,
  })
  @IsOptional()
  gender: string;

  @ApiProperty({
    description:
      'Date of birth is required and must be a valid date in the format YYYY-MM-DD.',
    example: '2000-05-15',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Date of birth is required!' })
  dateOfBirth: Date;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'User profile image',
    required: false,
  })
  @IsOptional()
  profileImage: any;

  @ApiProperty({
    description: 'School Id is required!',
    example: 'School Id',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'School must be a string' })
  schoolId: string;

  @ApiProperty({
    description: 'Dzongkhag Id is required!',
    example: 'Dzongkhag Id',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Dzongkhag must be a string' })
  dzongkhagId: string;
}
