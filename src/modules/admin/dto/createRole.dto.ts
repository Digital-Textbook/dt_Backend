import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
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
  role: string;
}
