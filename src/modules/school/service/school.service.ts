import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { School } from '../entities/school.entity';
import { CreateSchoolDto } from '../dto/school.dto';
import { Dzongkhag } from '../entities/dzongkhag.entity';
import { UpdateSchoolDto } from '../dto/updateSchool.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
  ) {}

  async addSchool(data: CreateSchoolDto) {
    const dzongkhagEntity = await this.dzongkhagRepository.findOne({
      where: { id: data.dzongkhagId },
    });
    if (!dzongkhagEntity) {
      throw new NotFoundException(
        `Dzongkhag with ID ${data.dzongkhagId} not found!`,
      );
    }

    const school = this.schoolRepository.create({
      schoolName: data.schoolName,
      dzongkhag: dzongkhagEntity,
    });

    const result = await this.schoolRepository.save(school);
    if (!result) {
      throw new InternalServerErrorException('Error while creating school!');
    }

    return school;
  }

  async deleteSchool(id: string) {
    const result = await this.schoolRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException('Error while deleting school!');
    }

    return { msg: 'School successfully deleted!' };
  }

  async updateSchool(id: string, data: UpdateSchoolDto) {
    const school = await this.schoolRepository.findOne({
      where: { id: id },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found!`);
    }
    const dzongkhag = await this.dzongkhagRepository.findOne({
      where: { id: data.dzongkhagId },
    });
    school.schoolName = data.schoolName;
    school.dzongkhag = dzongkhag;

    await this.schoolRepository.save(school);
    return { msg: 'School is updated successfully', school };
  }

  async getSchoolByDzongkhag(dzongkhagId: string) {
    const schools = await this.schoolRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.dzongkhag', 'dzongkhag')
      .where('dzongkhag.id = :dzongkhagId', { dzongkhagId })
      .getMany();

    if (!schools || schools.length === 0) {
      throw new NotFoundException(
        'No schools found for the specified Dzongkhag!',
      );
    }

    return schools;
  }

  async getSchoolById(id: string) {
    const school = await this.schoolRepository.findOne({
      where: { id: id },
      relations: ['dzongkhag'],
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }

    return school;
  }
}
