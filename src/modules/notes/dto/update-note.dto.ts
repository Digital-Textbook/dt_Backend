import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'New note to updated!',
    example: 'New notes about textbook or remainder!',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
