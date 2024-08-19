import { IsNotEmpty, IsEnum } from 'class-validator';
import { ClassEnum } from './ClassEnum';
export class CreateClassDto {
  @IsNotEmpty({ message: 'Class field is required' })
  @IsEnum(ClassEnum, {
    message: 'Class must be one of the following values: PP, 1, 2, 3, ..., 12',
  })
  class: ClassEnum;
}
