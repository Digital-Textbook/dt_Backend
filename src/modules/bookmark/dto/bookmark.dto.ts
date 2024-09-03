import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Notes for bookmark',
    example: 'Introduction of Physic',
  })
  @IsNotEmpty({ message: 'Notes are required' })
  @IsString({ message: 'Notes must be a string' })
  notes: string;

  @ApiProperty({
    description: 'Last page accessed',
    example: '80',
  })
  @IsNotEmpty({ message: 'Page number is required' })
  @IsString({ message: 'Page number must be a string' })
  pages: string;

  @ApiProperty({
    description: 'Start time of the session',
    example: '2023-09-01T10:00:00Z',
  })
  @IsNotEmpty({ message: 'Start time is required' })
  @IsDate({ message: 'Start time must be a valid date' })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the session',
    example: '2023-09-01T11:00:00Z',
  })
  @IsNotEmpty({ message: 'End time is required' })
  @IsDate({ message: 'End time must be a valid date' })
  endTime: Date;
}
