import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { CreateTextbookCommand } from './commands/create-textbook.command';
import { CreateTextbookDto } from './dtos/create-textbook.dto';
import { type TextbookDto } from './dtos/textbook.dto';
import { type TextbookPageOptionsDto } from './dtos/textbook-page-options.dto';
import { type UpdateTextbookDto } from './dtos/update-textbook.dto';
import { TextbookNotFoundException } from './exceptions/textbook-not-found.exception';
import { TextbookEntity } from './textbook.entity';

@Injectable()
export class TextbookService {
  constructor(
    @InjectRepository(TextbookEntity)
    private textbookRepository: Repository<TextbookEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createTextbook(
    createTextbookDto: CreateTextbookDto,
  ): Promise<TextbookEntity> {
    return this.commandBus.execute<CreateTextbookCommand, TextbookEntity>(
      new CreateTextbookCommand(createTextbookDto),
    );
  }

  async getAllTextbook(
    textbookPageOptionsDto: TextbookPageOptionsDto,
  ): Promise<PageDto<TextbookDto>> {
    const queryBuilder = this.textbookRepository
      .createQueryBuilder('textbook')
      .leftJoinAndSelect('textbook.translations', 'textbookTranslation');
    const [items, pageMetaDto] = await queryBuilder.paginate(
      textbookPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSingleTextbook(id: Uuid): Promise<TextbookEntity> {
    const queryBuilder = this.textbookRepository
      .createQueryBuilder('textbook')
      .where('textbook.id = :id', { id });

    const textbookEntity = await queryBuilder.getOne();

    if (!textbookEntity) {
      throw new TextbookNotFoundException();
    }

    return textbookEntity;
  }

  async updateTextbook(
    id: Uuid,
    updateTextbookDto: UpdateTextbookDto,
  ): Promise<void> {
    const queryBuilder = this.textbookRepository
      .createQueryBuilder('textbook')
      .where('textbook.id = :id', { id });

    const textbookEntity = await queryBuilder.getOne();

    if (!textbookEntity) {
      throw new TextbookNotFoundException();
    }

    this.textbookRepository.merge(textbookEntity, updateTextbookDto);

    await this.textbookRepository.save(updateTextbookDto);
  }

  async deleteTextbook(id: Uuid): Promise<void> {
    const queryBuilder = this.textbookRepository
      .createQueryBuilder('textbook')
      .where('textbook.id = :id', { id });

    const textbookEntity = await queryBuilder.getOne();

    if (!textbookEntity) {
      throw new TextbookNotFoundException();
    }

    await this.textbookRepository.remove(textbookEntity);
  }
}
