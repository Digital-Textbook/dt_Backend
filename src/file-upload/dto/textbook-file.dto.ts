import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextbookDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  textbook: any;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional description for the textbook' })
  description?: string;
}
