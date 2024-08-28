import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Class ID',
    example: '11',
  })
  @IsString({ message: 'Class ID is required' })
  classId: string;

  @ApiProperty({
    description: 'Name must be string',
    example: 'English 2',
  })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'Subject name must be string' })
  subjectName: string;
}
