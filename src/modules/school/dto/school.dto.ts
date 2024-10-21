import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'Dzongkhag ID is required!',
    example: 'Uuid of dzongkhag id',
  })
  @IsString({ message: 'Dzongkhag ID is required' })
  dzongkhagId: string;

  @ApiProperty({
    description: 'Gewog ID is required!',
    example: 'Uuid of gewog Id',
  })
  @IsString({ message: 'Gewog ID is required' })
  gewogId: string;

  @ApiProperty({
    description: 'School name must be string',
    example: 'Thimphu Primary School',
  })
  @IsNotEmpty({ message: 'The school name is required' })
  @IsString({ message: 'School name must be string' })
  schoolName: string;
}
