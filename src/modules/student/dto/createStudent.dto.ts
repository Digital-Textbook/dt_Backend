import { IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { ClassEnum } from 'src/constants/class-enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'Tenzin Norbu',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  @Length(1, 255, {
    message: 'Name must be between 1 and 255 characters long',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'CID is required',
    example: '11807009876',
  })
  @IsNotEmpty({ message: 'CID number is required' })
  @IsString({ message: 'CID number must be a string' })
  cid_no: string;

  @ApiProperty({
    description: 'Student code must follow this format: 201.00345.33.0006',
    example: '201.00345.33.0006',
  })
  @IsNotEmpty({ message: 'Student code is required' })
  @IsString({ message: 'Student code must be a string' })
  student_code: string;

  @ApiProperty({
    description: 'Class is required',
    example: '10',
  })
  @IsNotEmpty({ message: 'Class is required' })
  @IsEnum(ClassEnum, {
    message:
      'Class must be one of the following values: PP, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12',
  })
  class: ClassEnum;

  @ApiProperty({
    description: 'School name is required',
    example: 'Thimphu school',
  })
  @IsNotEmpty({ message: 'School is required' })
  @IsString({ message: 'School must be a string' })
  school: string;

  @ApiProperty({
    description: 'Dzongkhag is required',
    example: 'Thimphu',
  })
  @IsNotEmpty({ message: 'Dzongkhag is required' })
  @IsString({ message: 'Dzongkhag must be a string' })
  dzongkhag: string;
}
