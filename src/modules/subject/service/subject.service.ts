import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async deleteSubject(subjectId: string) {
    const result = await this.subjectRepository.delete(subjectId);
    if (result.affected === 0) {
      throw new InternalServerErrorException('Error while deleting subject!');
    }
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

    const result = await this.subjectRepository.save(subject);

    if (!result) {
      throw new InternalServerErrorException('Error while updating subject!');
    }

    return { msg: 'Subject successfully updated!', subject };
  }

  async getSubjectByClass(id: string) {
    const subject = await this.subjectRepository.find({
      where: { class: { id: id } },
    });

    if (!subject) {
      throw new NotFoundException(
        `Class with ID ${id} and related subject not found!`,
      );
    }

    return { msg: 'Subject with class Id successfully found!', subject };
  }

  async getAllSubject() {
    const subjects = await this.subjectRepository.find({
      relations: ['class'],
      select: ['subjectName', 'id'],
    });

    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('There are no subjects in the database!');
    }

    return subjects.map((subject) => ({
      className: subject.class.class,
      classId: subject.class.id,
      subjectName: subject.subjectName,
      subjectId: subject.id,
    }));
  }

  async getAllClass() {
    const classes = await this.classRepository.find({
      select: ['id', 'class'],
    });

    if (!classes || classes.length === 0) {
      throw new NotFoundException('There are no classes in the database!');
    }
    return classes;
  }
}
