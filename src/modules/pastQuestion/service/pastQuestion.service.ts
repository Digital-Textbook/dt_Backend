import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PastQuestionPaper } from '../entities/pastquestionpaper.entity';

@Injectable()
export class PastQuestionPaperService {
  constructor(
    @InjectRepository(PastQuestionPaper)
    private pastRepository: Repository<PastQuestionPaper>,
  ) {}
}
