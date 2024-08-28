import { IsNotEmpty, IsInt, IsString, IsUrl, IsEnum } from 'class-validator';
import { ClassEnum } from './ClassEnum';

export class CreatePastQuestionPaperDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Year is required' })
  @IsInt({ message: 'Year must be a number' })
  year: number;

  @IsNotEmpty({ message: 'Class is required' })
  @IsEnum(ClassEnum, { message: 'Class must be a valid' })
  class: ClassEnum;

  @IsNotEmpty({ message: 'Subject ID is required' })
  @IsInt({ message: 'Subject ID must be a number' })
  subjectId: number;

  @IsNotEmpty({ message: 'Subject is required' })
  @IsString({ message: 'Subject must be a string' })
  subject: string;

  @IsNotEmpty({ message: 'Past Question URL is required' })
  @IsUrl({}, { message: 'Past Question URL must be a valid URL' })
  pastQuestionUrl: string;
}
