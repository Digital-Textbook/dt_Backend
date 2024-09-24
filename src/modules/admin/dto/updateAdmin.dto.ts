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
  @IsString()
  mobile_no?: string;

  @ApiProperty({
    description: 'Roles is required',
    example: 'ADMIN',
  })
  @IsOptional()
  @IsString()
  roles?: string;

  @ApiProperty({
    description: 'Status is required',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  permission?: string[];
}
