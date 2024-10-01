import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Manage Products',
  })
  @IsNotEmpty({
    message: 'Permisson name is required',
  })
  @IsString({
    message: 'Permission name must be a string',
  })
  permissionName: string;

  @ApiProperty({
    description:
      'The action this permission allows (e.g., create, read, update, delete)',
    example: 'create',
  })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({
    description:
      'The subject or entity that the action is applied to (e.g., User, Product)',
    example: 'Product',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;
}
