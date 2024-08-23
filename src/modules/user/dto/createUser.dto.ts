import { IsNotEmpty, IsString, IsIn, IsEmail } from 'class-validator';
import {
  IsValidName,
  IsPhoneNumber,
  IsStrongPassword,
  IsStudentCode,
} from 'src/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'Tenzin Norbu',
  })
  @IsNotEmpty({
    message: 'The name is required',
  })
  @IsValidName()
  name: string;

  @ApiProperty({
    description: 'CID is required',
    example: '11807009876',
  })
  @IsNotEmpty({ message: 'CID number is required' })
  @IsString({ message: 'CID number must be an string' })
  cid_no: string;

  @ApiProperty({
    description: 'Student code must follow this format: 201.00345.33.0006',
    example: '201.00345.33.0006',
  })
  @IsStudentCode()
  student_code: string;

  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Phone number is required',
    example: '17543213',
  })
  @IsPhoneNumber()
  mobile_no: string;

  @ApiProperty({
    description: 'User type must be bhutanese or non-bhutanese',
    example: 'bhutanese',
  })
  @IsNotEmpty({ message: 'User type is required' })
  @IsIn(['bhutanese', 'non-bhutanese'], {
    message: 'User type must be either "bhutanese" or "non-bhutanese"',
  })
  user_type: 'bhutanese' | 'non-bhutanese';

  @ApiProperty({
    description: 'Password is required',
    example: 'Password#76',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'OTP option must be phone or email',
    example: 'email',
  })
  @IsNotEmpty({ message: 'OPT option is required' })
  @IsIn(['email', 'phone'], {
    message: 'OPT option must be either "email" or "phone"',
  })
  otpOption: 'email' | 'phone';
}
