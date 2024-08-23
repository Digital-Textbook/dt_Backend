import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { RoleType } from 'src/constants/role-type';

export class CreateAdminDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Mobile number is required',
  })
  @IsString({
    message: 'Mobile number must be a string',
  })
  @Matches(/^\d+$/, {
    message: 'Mobile number must contain only digits',
  })
  mobile_no: string;

  @IsNotEmpty({
    message: 'Role is required',
  })
  @IsEnum(RoleType, {
    message: 'Role must be either "super_admin" or "admin"',
  })
  roles: RoleType;

  @IsOptional()
  @IsArray({
    message: 'Permissions must be an array',
  })
  @ArrayNotEmpty({
    message: 'Permissions array should not be empty',
  })
  permission?: string[];

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be no longer than 32 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Passwords must contain at least:
  1 upper case letter
  1 lower case letter
  1 number or special character`,
  })
  password: string;
}
