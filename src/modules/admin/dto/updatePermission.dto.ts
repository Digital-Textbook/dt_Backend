import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Permisson must be string',
    example: 'Read',
  })
  @IsNotEmpty({
    message: 'Permisson name is required',
  })
  @IsString({
    message: 'Permission name must be a string',
  })
  @IsOptional()
  permissionName: string;
}
