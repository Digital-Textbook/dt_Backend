import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Dzongkhag)
    private dzongkhagRepository: Repository<Dzongkhag>,
    @InjectRepository(School) private schoolRepository: Repository<School>,
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
}
