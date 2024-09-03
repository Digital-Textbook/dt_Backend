import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
} from '@nestjs/common';

import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SubjectService } from '../service/subject.service';
import { CreateSubjectDto } from '../dto/createSubject.dto';

@Controller('subject')
@ApiTags('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('/')
  @ApiOkResponse({ description: 'Subject creacted successfully!' })
  @ApiBadRequestResponse({
    description: 'Subject cannot be created. Please try again',
  })
  async addSubject(@Body() data: CreateSubjectDto) {
    return await this.subjectService.addSubject(data);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Subject delete successfully!' })
  @ApiBadRequestResponse({
    description: 'Subject cannot be delete. Please try again',
  })
  async deleteSubject(@Param('id') id: string) {
    return await this.subjectService.deleteSubject(id);
  }

  @Patch(':id/subject/:subjectName')
  @ApiOkResponse({ description: 'Subject updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Subject cannot be updated. Please try again',
  })
  async updateSubject(
    @Param('id') id: string,
    @Param('subjectName') subjectName: string,
  ) {
    return await this.subjectService.updateSubject(id, subjectName);
  }

  @Get(':id/subject')
  @ApiOkResponse({ description: 'Subject successfully found based on Class.' })
  @ApiBadRequestResponse({
    description: 'Subject not found based on Class. Please try again',
  })
  async getSubject(@Param('id') id: string) {
    return await this.subjectService.getSubjectByClass(id);
  }

  @Get('/allSubject')
  async getAllSubject() {
    return await this.subjectService.getAllSubject();
  }
}
