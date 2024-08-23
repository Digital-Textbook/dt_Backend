import { IsNotEmpty, IsString, Length, IsEnum } from 'class-validator';
import { ClassEnum } from 'src/constants/class-enum';

export class CreateStudentDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @Length(1, 255, {
    message: 'Name must be between 1 and 255 characters long',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'CID number is required' })
  @IsString({ message: 'CID number must be a string' })
  cid_no: string;

  @IsNotEmpty({ message: 'Student code is required' })
  @IsString({ message: 'Student code must be a string' })
  student_code: string;

  @IsNotEmpty({ message: 'Class is required' })
  @IsEnum(ClassEnum, {
    message:
      'Class must be one of the following values: PP, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12',
  })
  class: ClassEnum;

  @IsNotEmpty({ message: 'School is required' })
  @IsString({ message: 'School must be a string' })
  school: string;

  @IsNotEmpty({ message: 'Dzongkhag is required' })
  @IsString({ message: 'Dzongkhag must be a string' })
  dzongkhag: string;
}
