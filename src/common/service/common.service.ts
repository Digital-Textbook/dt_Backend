import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/modules/class/entities/class.entity';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
    @InjectRepository(Class) private classRepository: Repository<Class>,
  ) {}

  async getAllDzongkhag(dzongkhagName?: string) {
    const query = this.dzongkhagRepository
      .createQueryBuilder('dzongkhag')
      .select(['dzongkhag.id', 'dzongkhag.name']);

    if (dzongkhagName) {
      query.where('dzongkhag.name ILIKE :name', { name: `${dzongkhagName}%` });
    }

    const dzongkhag = await query.getMany();

    if (!dzongkhag || dzongkhag.length === 0) {
      throw new NotFoundException('No dzongkhag found!');
    }

    return dzongkhag;
  }

  async getAllSchool(schoolName?: string) {
    const query = this.schoolRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.dzongkhag', 'dzongkhag')
      .select([
        'school.id',
        'school.schoolName',
        'dzongkhag.name',
        'dzongkhag.id',
      ]);

    if (schoolName) {
      query.where('school.schoolName ILIKE :schoolName', {
        schoolName: `${schoolName}%`,
      });
    }

    const schools = await query.getMany();

    if (!schools || schools.length === 0) {
      throw new NotFoundException('No school found!');
    }
    return schools.map((school) => ({
      school: school.schoolName,
      dzongkhagName: school.dzongkhag.name,
      schoolId: school.id,
      dzongkhagId: school.dzongkhag.id,
    }));
  }

  async getSubjectByClass(classId: string) {
    if (!this.isValidClassId(classId)) {
      throw new BadRequestException('Invalid class ID format!');
    }
    const subjects = await this.subjectRepository.find({
      where: { class: { id: classId } },
      relations: ['class'],
      select: ['id', 'subjectName'],
    });

    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('Class not found or no subjects available!');
    }

    return subjects.map((subject) => ({
      className: subject.class.class,
      classId: subject.class.id,
      subjectName: subject.subjectName,
      subjectId: subject.id,
    }));
  }

  private isValidClassId(classId: string): boolean {
    return isUUID(classId);
  }
}
