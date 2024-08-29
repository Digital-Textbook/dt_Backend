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
import { SchoolService } from '../service/school.service';
import { CreateSchoolDto } from '../dto/school.dto';
import { UpdateSchoolDto } from '../dto/updateSchool.dto';

@Controller('school')
@ApiTags('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/')
  @ApiOkResponse({ description: 'School creacted successfully!' })
  @ApiBadRequestResponse({
    description: 'School cannot be created. Please try again',
  })
  async addSubject(@Body() data: CreateSchoolDto) {
    return await this.schoolService.addSchool(data);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'School delete successfully!' })
  @ApiBadRequestResponse({
    description: 'School cannot be delete. Please try again',
  })
  async deleteSubject(@Param('id') id: string) {
    return await this.schoolService.deleteSchool(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'School updated successfully!' })
  @ApiBadRequestResponse({
    description: 'School cannot be updated. Please try again',
  })
  async updateSchool(@Param('id') id: string, @Body() data: UpdateSchoolDto) {
    return await this.schoolService.updateSchool(id, data);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'School not found. Please try again',
  })
  async getSubject(@Param('id') id: string) {
    return await this.schoolService.getSchoolByDzongkhag(id);
  }
}
