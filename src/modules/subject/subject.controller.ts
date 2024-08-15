import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { type SubjectDto } from './dtos/subject.dto';
import { SubjectPageOptionsDto } from './dtos/subject-page-options.dto';
import { UpdateSubjectDto } from './dtos/update-subject.dto';
import { SubjectService } from './subject.service';

@Controller('subjects')
@ApiTags('subjects')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    const entity = await this.subjectService.createSubject(createSubjectDto);

    return entity.toDto();
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllSubject(
    @Query() subjectPageOptionsDto: SubjectPageOptionsDto,
  ): Promise<PageDto<SubjectDto>> {
    return this.subjectService.getAllSubject(subjectPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleSubject(@UUIDParam('id') id: Uuid): Promise<SubjectDto> {
    const entity = await this.subjectService.getSingleSubject(id);

    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateSubject(
    @UUIDParam('id') id: Uuid,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<void> {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteSubject(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.subjectService.deleteSubject(id);
  }
}
