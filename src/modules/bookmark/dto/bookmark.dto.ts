import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'Last page accessed',
    example: '80',
  })
  @IsNotEmpty({ message: 'Page number is required' })
  @IsString({ message: 'Page number must be a string' })
  pageNumber: string;

  @ApiProperty({
    description: 'Textbook ID',
    example: '9a674df4-0c1c-4d9b-9ad6-915fd4d1e939',
  })
  @IsNotEmpty({ message: 'Textbook ID is required' })
  @IsUUID('4', { message: 'Textbook ID must be a valid UUID' })
  textbookId: string;
}
