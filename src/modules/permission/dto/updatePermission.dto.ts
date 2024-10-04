import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({
    description:
      'The action this permission allows (e.g., create, read, update, delete)',
    example: 'create',
  })
  @ApiPropertyOptional()
  action: string;

  @ApiProperty({
    description:
      'The subject or entity that the action is applied to (e.g., User, Product)',
    example: 'Product',
  })
  @ApiPropertyOptional()
  subject: string;
}
