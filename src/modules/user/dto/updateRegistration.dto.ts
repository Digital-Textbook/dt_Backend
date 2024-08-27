import { IsNotEmpty, IsString, IsIn, IsEmail } from 'class-validator';
import { IsPhoneNumber } from 'src/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class updateRegister {
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
  mobileNo: string;

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
