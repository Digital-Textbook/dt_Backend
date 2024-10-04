import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'src/decorators/field.decorators';
import { Role } from '../../role/entities/role.entity';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'John Doe',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

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
    description: 'Role assigned to the admin',
    example: 'roleId',
  })
  @IsNotEmpty({
    message: 'Role is required',
  })
  roleId: Role;
}
