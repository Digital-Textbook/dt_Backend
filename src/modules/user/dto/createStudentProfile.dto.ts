import { IsNotEmpty, IsInt, IsString, Length } from 'class-validator';

export class CreateStudentProfileDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @Length(1, 255, {
    message: 'Name must be between 1 and 255 characters long',
  })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Student code is required' })
  @IsInt({ message: 'Student code must be an string' })
  student_code: string;

  @IsNotEmpty({ message: 'Mobile number is required' })
  @IsInt({ message: 'Mobile number must be an string' })
  mobile_no: string;

  @IsNotEmpty({ message: 'Class is required' })
  @IsString({ message: 'Class must be a string' })
  class: string;

  @IsNotEmpty({ message: 'School is required' })
  @IsString({ message: 'School must be a string' })
  school: string;

  @IsNotEmpty({ message: 'Dzongkhag is required' })
  @IsString({ message: 'Dzongkhag must be a string' })
  dzongkhag: string;
}
