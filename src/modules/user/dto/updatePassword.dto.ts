import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserProfilePassword {
  @ApiProperty({
    description: 'Current password is required',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword?: string;

  @ApiProperty({
    description: 'New password is required',
    example: '87654321',
  })
  @IsNotEmpty()
  @IsString()
  newPassword?: string;

  @ApiProperty({
    description: 'Confirm password is required',
    example: '87654321',
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword?: string;
}
