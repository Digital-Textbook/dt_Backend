import {
  IsOptional,
  IsString,
  IsEmail,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../role/entities/role.entity';

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Name must be a string',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email must be a valid email address',
    example: 'example@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Phone number must be a string',
    example: '17543213',
  })
  @IsOptional()
  @IsString()
  mobileNo?: string;

  @ApiProperty({
    description: 'Role must reference a valid role entity',
    example: 'Role ID',
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'Role ID must be a valid UUID',
  })
  roleId?: string;

  @ApiProperty({
    description: 'Status is either active or inactive',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  status?: 'active' | 'inactive';
}
