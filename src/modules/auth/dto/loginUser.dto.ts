import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'CID is required',
    example: '11806001234',
  })
  @IsString()
  cidNo: string;

  @ApiProperty({ description: 'Password is required', example: '12345678' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
