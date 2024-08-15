import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type CreateSubjectDto } from '../dtos/create-subject.dto';
import { SubjectEntity } from '../subject.entity';

export class CreateSubjectCommand implements ICommand {
  constructor(public readonly createSubjectDto: CreateSubjectDto) {}
}

@CommandHandler(CreateSubjectCommand)
export class CreateSubjectHandler
  implements ICommandHandler<CreateSubjectCommand, SubjectEntity>
{
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
  ) {}

  async execute(command: CreateSubjectCommand) {
    const { createSubjectDto } = command;
    const subjectEntity = this.subjectRepository.create(createSubjectDto);

    await this.subjectRepository.save(subjectEntity);

    return subjectEntity;
  }
}
