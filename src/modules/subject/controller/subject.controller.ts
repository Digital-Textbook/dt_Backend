import { Controller, Param, Post, Body } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { SubjectService } from '../service/subject.service';
import { CreateSubjectDto } from '../dto/createSubject.dto';

@Controller('subject')
@ApiTags('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('/')
  async addSubject(@Body() data: CreateSubjectDto) {
    console.log('ID: ', data.classId);
    console.log('Subject: ', data.subjectName);
    return await this.subjectService.addSubject(data);
  }
}
