import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Role must be string',
    example: 'ADMIN',
  })
  @IsNotEmpty({
    message: 'Role is required',
  })
  @IsString({
    message: 'Role must be a string',
  })
  @IsOptional()
  role: string;
}
