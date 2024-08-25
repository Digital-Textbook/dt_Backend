import { IsOptional, IsString, IsEmail, IsArray, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email is required',
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number is required',
    example: '17543213',
  })
  @IsOptional()
  @IsInt()
  mobile_no?: string;

  @IsOptional()
  @IsString()
  roles?: string;

  @IsOptional()
  @IsArray()
  permission?: string[];

  @ApiProperty({
    description: 'Password is required',
    example: 'Password#76',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
