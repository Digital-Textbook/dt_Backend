import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { type PageDto } from '../../common/dto/page.dto';
import { CreateSubjectCommand } from './commands/create-subject.command';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { type SubjectDto } from './dtos/subject.dto';
import { type SubjectPageOptionsDto } from './dtos/subject-page-options.dto';
import { type UpdateSubjectDto } from './dtos/update-subject.dto';
import { SubjectNotFoundException } from './exceptions/subject-not-found.exception';
import { SubjectEntity } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SubjectEntity)
    private subjectRepository: Repository<SubjectEntity>,
    private commandBus: CommandBus,
  ) {}

  @Transactional()
  createSubject(createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    return this.commandBus.execute<CreateSubjectCommand, SubjectEntity>(
      new CreateSubjectCommand(createSubjectDto),
    );
  }

  async getAllSubject(
    subjectPageOptionsDto: SubjectPageOptionsDto,
  ): Promise<PageDto<SubjectDto>> {
    const queryBuilder = this.subjectRepository
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.translations', 'subjectTranslation');
    const [items, pageMetaDto] = await queryBuilder.paginate(
      subjectPageOptionsDto,
    );

    return items.toPageDto(pageMetaDto);
  }

  async getSingleSubject(id: Uuid): Promise<SubjectEntity> {
    const queryBuilder = this.subjectRepository
      .createQueryBuilder('subject')
      .where('subject.id = :id', { id });

    const subjectEntity = await queryBuilder.getOne();

    if (!subjectEntity) {
      throw new SubjectNotFoundException();
    }

    return subjectEntity;
  }

  async updateSubject(
    id: Uuid,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<void> {
    const queryBuilder = this.subjectRepository
      .createQueryBuilder('subject')
      .where('subject.id = :id', { id });

    const subjectEntity = await queryBuilder.getOne();

    if (!subjectEntity) {
      throw new SubjectNotFoundException();
    }

    this.subjectRepository.merge(subjectEntity, updateSubjectDto);

    await this.subjectRepository.save(updateSubjectDto);
  }

  async deleteSubject(id: Uuid): Promise<void> {
    const queryBuilder = this.subjectRepository
      .createQueryBuilder('subject')
      .where('subject.id = :id', { id });

    const subjectEntity = await queryBuilder.getOne();

    if (!subjectEntity) {
      throw new SubjectNotFoundException();
    }

    await this.subjectRepository.remove(subjectEntity);
  }
}
