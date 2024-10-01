import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role must be string',
    example: 'ADMIN',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description!: string;
}
