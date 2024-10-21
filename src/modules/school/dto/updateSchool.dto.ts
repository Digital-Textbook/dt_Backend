import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSchoolDto {
  @ApiProperty({
    description: 'Dzongkhag ID is required!',
    example: 'Uuid of Dzongkhag ID',
  })
  @IsString({ message: 'Class ID is required' })
  @IsOptional()
  dzongkhagId: string;

  @ApiProperty({
    description: 'Gewog ID is required!',
    example: 'Uuid of Gewog ID',
  })
  @IsString({ message: 'Gewog ID is required' })
  @IsOptional()
  gewogId: string;

  @ApiProperty({
    description: 'School name must be string',
    example: 'Thimphu Primary School',
  })
  @IsString({ message: 'School name must be string' })
  @IsOptional()
  schoolName: string;
}
