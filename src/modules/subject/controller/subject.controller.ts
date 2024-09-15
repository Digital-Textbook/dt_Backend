import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubjectService } from '../service/subject.service';
import { CreateSubjectDto } from '../dto/createSubject.dto';

@Controller('Digital-textbook/subject')
@ApiTags('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'Subject creacted successfully!' })
  @ApiNotFoundResponse({ description: 'Invalid Class Id!' })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please try again',
  })
  @ApiInternalServerErrorResponse({
    description: 'Subject cannot be created. Please try again',
  })
  async addSubject(@Body() data: CreateSubjectDto) {
    return await this.subjectService.addSubject(data);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Subject delete successfully!' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting subject!',
  })
  async deleteSubject(@Param('id') id: string) {
    return await this.subjectService.deleteSubject(id);
  }

  @Patch(':id/subject/:subjectName')
  @ApiOkResponse({ description: 'Subject updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Subject cannot be updated. Please try again',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating subject!',
  })
  async updateSubject(
    @Param('id') id: string,
    @Param('subjectName') subjectName: string,
  ) {
    return await this.subjectService.updateSubject(id, subjectName);
  }

  @Get(':classId/subject')
  @ApiOkResponse({ description: 'Subject successfully found based on Class.' })
  @ApiBadRequestResponse({
    description: 'Subject not found based on Class. Please try again',
  })
  @ApiNotFoundResponse({ description: 'Invalid class. Try again!' })
  async getSubject(@Param('classId') classId: string) {
    return await this.subjectService.getSubjectByClass(classId);
  }

  @Get('/allSubject')
  @ApiOkResponse({ description: 'Subject found!' })
  @ApiNotFoundResponse({
    description: 'Error while fetching subject!',
  })
  async getAllSubject() {
    return await this.subjectService.getAllSubject();
  }
}
