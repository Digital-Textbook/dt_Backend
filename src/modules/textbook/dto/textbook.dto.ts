import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTextbookDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'Tshering Dawa',
  })
  @IsNotEmpty({ message: 'The name of author is required!' })
  @IsString({ message: 'Author name must be string' })
  author: string;

  @ApiProperty({
    description: 'Total number of chapters in textbook.',
    example: '12',
  })
  @IsNotEmpty({ message: 'Total number of chapters in textbook is required!' })
  @IsString({ message: 'Number of chapter must be string' })
  chapter: string;

  @ApiProperty({
    description: 'Total number of pages in textbook.',
    example: '248',
  })
  @IsNotEmpty({ message: 'Total number of pages in textbook is required!' })
  @IsString({ message: 'Number of pages must be string' })
  totalPages: string;

  @ApiProperty({
    description: 'Summary of textbook.',
    example: 'Introduction of History',
  })
  @IsNotEmpty({ message: 'Summary of textbook is required!' })
  @IsString({ message: 'Summary must be string' })
  summary: string;

  @ApiProperty({
    description: 'Number of edition of textbook.',
    example: 'First edition',
  })
  @IsNotEmpty({ message: 'Edition is required!' })
  @IsString({ message: 'Edition must be string' })
  edition: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of textbook',
  })
  textbookImage: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Content of textbook',
  })
  textbookFile: any;

  @ApiProperty({
    description: 'Subject ID',
  })
  @IsNotEmpty({ message: 'Subject ID is required!' })
  @IsString({ message: 'Subject ID be string' })
  subjectId: string;
}
