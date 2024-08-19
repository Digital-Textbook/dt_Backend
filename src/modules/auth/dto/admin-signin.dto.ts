import { IsNotEmpty, IsString } from 'class-validator';
import { IsEmailField } from 'src/decorators/field.decorators';

export class LoginAdminDto {
  @IsEmailField({
    message: 'Email address format is invalid!.',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
