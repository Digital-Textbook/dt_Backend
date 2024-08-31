import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadSingleFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional description for the image' })
  description?: string;
}
