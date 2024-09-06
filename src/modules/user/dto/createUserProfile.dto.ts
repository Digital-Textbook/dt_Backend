import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsDateString,
  IsMobilePhone,
} from 'class-validator';
import { Gender } from 'src/constants/gender';
import { IsStudentCode } from 'src/decorators/field.decorators';

export class CreateUserProfileDto {
  @ApiProperty({
    description: 'Name is required!',
    example: 'Tshering',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 255, {
    message: 'Name must be between 2 and 255 characters long',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'Student code is required!',
    example: '201.00345.33.0042',
  })
  @IsNotEmpty({ message: 'Student code is required' })
  @IsStudentCode({
    message: 'Student code must match the pattern 201.00345.33.0042',
  })
  studentCode: string;

  @ApiProperty({
    description: 'Mobile Number is required!',
    example: '17654321',
  })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsMobilePhone()
  mobileNo: string;

  @ApiProperty({
    description: 'Class is required!',
    example: '10',
  })
  @IsNotEmpty({ message: 'Class is required' })
  @IsString({ message: 'Class must be a string' })
  class: string;

  @IsNotEmpty({ message: 'School is required' })
  @IsString({ message: 'School must be a string' })
  schoolId: string;

  @IsNotEmpty({ message: 'Dzongkhag is required' })
  @IsString({ message: 'Dzongkhag must be a string' })
  dzongkhagId: string;

  @ApiProperty({
    description: 'User gender must be Male or Female',
    example: 'Male',
  })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: 'Gender must be Male or Female!',
  })
  gender: Gender;

  @ApiProperty({
    description:
      'Date of birth is required and must be a valid date in the format YYYY-MM-DD.',
    example: '2000-05-15',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString(
    {},
    {
      message:
        'Date of birth must be a valid date string in the format YYYY-MM-DD',
    },
  )
  dateOfBirth: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User Id must be UUID' })
  userId: string;
}
