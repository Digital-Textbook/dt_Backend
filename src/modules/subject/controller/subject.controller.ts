import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SubjectService } from '../service/subject.service';
import { CreateSubjectDto } from '../dto/createSubject.dto';
import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { Auth } from 'src/modules/guard/auth.guard';

@ApiTags('subject')
@Controller('digital-textbook/subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Post('/')
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Permissions('create')
  @Roles('Admin', 'Super Admin')
  @ApiCreatedResponse({ description: 'Subject creacted successfully!' })
  @ApiNotFoundResponse({ description: 'Invalid Class Id!' })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check input data!',
  })
  async addSubject(@Body() data: CreateSubjectDto) {
    return await this.subjectService.addSubject(data);
  }

  @Delete('/:id')
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Permissions('delete')
  @Roles('Admin', 'Super Admin')
  @ApiOkResponse({ description: 'Subject delete successfully!' })
  @ApiNotFoundResponse({ description: 'Subject ID not found!' })
  async deleteSubject(@Param('id') id: string) {
    return await this.subjectService.deleteSubject(id);
  }

  @Patch('/:id')
  @UseGuards(Auth)
  @ApiBearerAuth()
  @Permissions('update')
  @Roles('Admin', 'Super Admin')
  @ApiOkResponse({ description: 'Subject updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Subject cannot be updated. Please try again',
  })
  async updateSubject(
    @Param('id') id: string,
    @Body() subjectData: CreateSubjectDto,
  ) {
    return await this.subjectService.updateSubject(id, subjectData);
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

  @Get('/')
  @ApiOkResponse({ description: 'Subject found!' })
  @ApiNotFoundResponse({
    description: 'Error while fetching subject!',
  })
  async getAllSubject() {
    return await this.subjectService.getAllSubject();
  }

  @Get('/class')
  @ApiOkResponse({ description: 'Classes not found in database!' })
  @ApiNotFoundResponse({
    description: 'Error while fetching classes!',
  })
  async getAllClass() {
    return await this.subjectService.getAllClass();
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Subject data not found in database!' })
  @ApiNotFoundResponse({
    description: 'Error while fetching subject data!',
  })
  async getSubjectById(@Param('id') id: string) {
    return await this.subjectService.getSubjectById(id);
  }
}
