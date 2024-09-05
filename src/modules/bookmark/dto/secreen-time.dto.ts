import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsUUID } from 'class-validator';

export class CreateScreenTimeDto {
  @ApiProperty({
    description: 'Start time of the session',
    example: '2023-09-01T10:00:00Z',
  })
  @IsNotEmpty({ message: 'Start time is required' })
  @IsDate({ message: 'Start time must be a valid date' })
  accessTime: Date;

  @ApiProperty({
    description: 'End time of the session',
    example: '2023-09-01T11:00:00Z',
  })
  @IsNotEmpty({ message: 'End time is required' })
  @IsDate({ message: 'End time must be a valid date' })
  endTime: Date;

  @ApiProperty({
    description: 'User ID',
    example: '9a674df4-0c1c-4d9b-9ad6-915fd4d1e938',
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Textbook ID',
    example: '9a674df4-0c1c-4d9b-9ad6-915fd4d1e939',
  })
  @IsNotEmpty({ message: 'Textbook ID is required' })
  @IsUUID('4', { message: 'Textbook ID must be a valid UUID' })
  textbookId: string;
}
