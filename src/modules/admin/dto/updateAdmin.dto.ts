import { IsOptional, IsString, IsEmail, IsArray, IsInt } from 'class-validator';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsInt()
  mobile_no?: string;

  @IsOptional()
  @IsString()
  roles?: string;

  @IsOptional()
  @IsArray()
  permission?: string[];

  @IsOptional()
  @IsString()
  password?: string;
}
