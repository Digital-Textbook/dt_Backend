import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role can be ADMIN, SUPER ADMIN and etc',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Description of their role',
    example:
      'Has access to all administrative features, including user management and system settings',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description!: string;
}
