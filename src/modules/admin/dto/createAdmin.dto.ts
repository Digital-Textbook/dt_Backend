import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { RoleType } from 'src/constants/role-type';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsStrongPassword,
} from 'src/decorators/field.decorators';

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
  mobile_no: string;

  @ApiProperty({
    description: 'User type must be admin or super admin',
    example: 'ADMIN',
  })
  @IsNotEmpty({
    message: 'Role is required',
  })
  @IsEnum(RoleType, {
    message: 'Role must be either "super_admin" or "admin"',
  })
  roles: RoleType;

  @ApiProperty({
    description: 'User type must be admin or super admin',
    example: '["create", "delete"]',
  })
  @IsOptional()
  @IsArray({
    message: 'Permissions must be an array',
  })
  @ArrayNotEmpty({
    message: 'Permissions array should not be empty',
  })
  permission?: string[];

  //   @ApiProperty({
  //     description: 'Password is required',
  //     example: 'Password#76',
  //   })
  //   @IsStrongPassword()
  //   password: string;
}
