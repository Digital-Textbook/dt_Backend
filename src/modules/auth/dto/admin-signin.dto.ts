import { IsNotEmpty, IsString } from 'class-validator';
import { IsEmailField } from 'src/decorators/field.decorators';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @IsEmailField({
    message: 'Email address format is invalid!.',
  })
  email: string;

  @ApiProperty({ description: 'Password is required', example: '12345678' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
