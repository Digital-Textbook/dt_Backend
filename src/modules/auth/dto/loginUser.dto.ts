import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsStudentCode } from 'src/decorators/field.decorators';

export class LoginUserDto {
  @ApiProperty({
    description: 'Student Code is required',
    example: '201.00345.33.0006',
  })
  @IsStudentCode({
    message:
      'Invalid student code format. It must be in the format 201.00345.33.0042',
  })
  student_code: string;

  @ApiProperty({ description: 'Password is required', example: '12345678' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
