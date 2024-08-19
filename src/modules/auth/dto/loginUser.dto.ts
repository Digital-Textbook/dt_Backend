import { IsNotEmpty, IsString } from 'class-validator';
import { IsStudentCode } from 'src/decorators/field.decorators';

export class LoginUserDto {
  @IsStudentCode({
    message:
      'Invalid student code format. It must be in the format 201.00345.33.0042',
  })
  student_code: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
