import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Textbook } from '../entities/textbook.entity';

@Injectable()
export class TextbookService {
  constructor(
    @InjectRepository(Textbook) private subjectRepository: Repository<Textbook>,
  ) {}
}
