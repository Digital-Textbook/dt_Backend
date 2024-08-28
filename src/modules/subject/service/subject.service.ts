import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from '../dto/createSubject.dto';
import { Class } from 'src/modules/class/entities/class.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
  ) {}

  async addSubject(data: CreateSubjectDto) {
    const classEntity = await this.classRepository.findOne({
      where: { id: data.classId },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${data.classId} not found`);
    }

    const subject = this.subjectRepository.create({
      subjectName: data.subjectName,
      class: classEntity,
    });

    return await this.subjectRepository.save(subject);
  }
}
