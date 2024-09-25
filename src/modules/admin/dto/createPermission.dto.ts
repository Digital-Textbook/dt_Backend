import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
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
  permissionName: string;
}
