import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTextbookDto {
  @ApiProperty({
    description: 'Name must be string',
    example: 'Tshering Dawa',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Author name must be string' })
  author: string;

  @ApiProperty({
    description: 'Total number of chapters in textbook.',
    example: '12',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Number of chapter must be string' })
  chapter: string;

  @ApiProperty({
    description: 'Total number of pages in textbook.',
    example: '248',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Number of pages must be string' })
  totalPages: string;

  @ApiProperty({
    description: 'Summary of textbook.',
    example: 'Introduction of History',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Summary must be string' })
  summary: string;

  @ApiProperty({
    description: 'Number of edition of textbook.',
    example: 'First edition',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Edition must be string' })
  edition: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image of textbook',
    required: false,
  })
  @IsOptional()
  textbookImage: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Content of textbook',
    required: false,
  })
  @IsOptional()
  textbookFile: any;

  @ApiProperty({
    description: 'Subject ID',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Subject ID be string' })
  subjectID: string;
}
