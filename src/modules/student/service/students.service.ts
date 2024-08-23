import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Students } from '../../student/entities/students.entity';
import { CreateStudentDto } from '../../student/dto/createStudent.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Students)
    private studentRepository: Repository<Students>,
  ) {}

  async getStudents(): Promise<Students[]> {
    return await this.studentRepository.find();
  }

  async getStudentByCid(cid_no: string): Promise<Students> {
    if (!cid_no) {
      throw new Error('CID No is required');
    }

    const student = await this.studentRepository.findOne({
      where: { cid_no },
    });

    if (!student) {
      throw new NotFoundException('No matching data found');
    }

    return student;
  }

  async createNewStudent(students: CreateStudentDto) {
    return await this.studentRepository.save(students);
  }
}
