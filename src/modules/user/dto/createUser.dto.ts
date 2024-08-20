import { IsNotEmpty, IsString, IsIn, IsEmail } from 'class-validator';
import {
  IsValidName,
  IsPhoneNumber,
  IsStrongPassword,
  IsStudentCode,
} from 'src/decorators/field.decorators';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'The name is required',
  })
  @IsValidName()
  name: string;

  @IsNotEmpty({ message: 'CID number is required' })
  @IsString({ message: 'CID number must be an string' })
  cid_no: string;

  @IsStudentCode()
  student_code: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsPhoneNumber()
  mobile_no: string;

  @IsNotEmpty({ message: 'User type is required' })
  @IsIn(['bhutanese', 'non-bhutanese'], {
    message: 'User type must be either "bhutanese" or "non-bhutanese"',
  })
  user_type: 'bhutanese' | 'non-bhutanese';

  @IsStrongPassword()
  password: string;
}
