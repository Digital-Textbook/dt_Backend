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

  async updateSubject(id: string, subjectData: CreateSubjectDto) {
    const subject = await this.subjectRepository.findOne({
      where: { id },
      relations: ['class'],
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found!`);
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: subjectData.classId },
    });

    if (!classEntity) {
      throw new NotFoundException(
        `Class with ID ${subjectData.classId} not found!`,
      );
    }

    subject.subjectName = subjectData.subjectName;
    subject.class = classEntity;

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
      select: ['id', 'subjectName', 'createdAt'],
    });

    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('There are no subjects in the database!');
    }

    return subjects.map((subject) => ({
      className: subject.class.class,
      classId: subject.class.id,
      subjectName: subject.subjectName,
      id: subject.id,
      createdAt: subject.createdAt,
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

  async getSubjectById(id: string) {
    const subjects = await this.subjectRepository.findOne({
      where: { id: id },
      relations: ['class'],
      select: ['subjectName', 'id'],
    });

    if (!subjects) {
      throw new NotFoundException(`Subject not found with ID ${id}`);
    }

    return {
      class: subjects.class.class,
      classId: subjects.class.id,
      subjectName: subjects.subjectName,
      id: subjects.id,
    };
  }
}
