import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UploadMultipleFilesDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image1: any;
  @IsOptional()
  @IsString()
  description1?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image2: any;
  @IsOptional()
  @IsString()
  description2?: string;
}
