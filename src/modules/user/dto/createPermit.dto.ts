import { IsNotEmpty, IsString, IsEnum, IsEmail, IsIn } from 'class-validator';
import { IsPhoneNumber, IsValidName } from 'src/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/constants/gender';
import { userType } from 'src/constants/user-type';

export class permitOrNon {
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
  permitNo: string;

  @ApiProperty({
    description: 'Gender must be MALE or FEMALE',
    example: 'MALE',
  })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: 'Gender must be MALE or FEMALE',
  })
  gender: Gender;

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

  @ApiProperty({
    description: 'User type must be bhutanese or non-bhutanese',
    example: 'Bhutanese_with_permit',
  })
  @IsNotEmpty({ message: 'User type is required' })
  @IsEnum(userType, {
    message:
      'User type must be either "bhutanese with cid", "bhutanese without cid" or "non-bhutanese"',
  })
  userType: userType;
}
