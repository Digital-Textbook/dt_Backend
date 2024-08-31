import { IsString, IsOptional } from 'class-validator';

export class UploadMultipleFilesDto {
  @IsOptional()
  @IsString()
  description1?: string;

  @IsOptional()
  @IsString()
  description2?: string;
}
