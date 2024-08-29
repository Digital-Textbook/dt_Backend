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

  async deleteSubject(id: string) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    await this.subjectRepository.delete(id);

    return { msg: 'Subject successfully deleted!' };
  }

  async updateSubject(id: string, name: string) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found!`);
    }

    subject.subjectName = name;

    await this.subjectRepository.save(subject);

    return { msg: 'Subject successfully updated!', subject };
  }

  async getSubjectByClass(id: string) {
    const subject = await this.subjectRepository.find({
      where: { class: { id: id } },
      //   relations: ['class'],
    });

    if (!subject) {
      throw new NotFoundException(
        `Class with ID ${id} and related subject not found!`,
      );
    }

    return { msg: 'Subject with class Id successfully found!', subject };
  }
}
