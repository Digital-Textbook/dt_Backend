import {
  CommandHandler,
  type ICommand,
  type ICommandHandler,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type CreateTextbookDto } from '../dtos/create-textbook.dto';
import { TextbookEntity } from '../textbook.entity';

export class CreateTextbookCommand implements ICommand {
  constructor(public readonly createTextbookDto: CreateTextbookDto) {}
}

@CommandHandler(CreateTextbookCommand)
export class CreateTextbookHandler
  implements ICommandHandler<CreateTextbookCommand, TextbookEntity>
{
  constructor(
    @InjectRepository(TextbookEntity)
    private textbookRepository: Repository<TextbookEntity>,
  ) {}

  async execute(command: CreateTextbookCommand) {
    const { createTextbookDto } = command;
    const textbookEntity = this.textbookRepository.create(createTextbookDto);

    await this.textbookRepository.save(textbookEntity);

    return textbookEntity;
  }
}
