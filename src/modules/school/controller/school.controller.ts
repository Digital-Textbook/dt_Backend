import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  HttpCode,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SchoolService } from '../service/school.service';
import { CreateSchoolDto } from '../dto/school.dto';
import { UpdateSchoolDto } from '../dto/updateSchool.dto';

@ApiTags('school')
@Controller('digital-textbook/school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'School creacted successfully!' })
  @ApiNotFoundResponse({ description: 'Dzongkhag Id is invalid!' })
  @ApiInternalServerErrorResponse({
    description: 'Error while creating school!',
  })
  async addSubject(@Body() data: CreateSchoolDto) {
    return await this.schoolService.addSchool(data);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'School delete successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid School ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Error while deleting school!',
  })
  async deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return await this.schoolService.deleteSchool(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'School updated successfully!' })
  @ApiBadRequestResponse({
    description: 'School cannot be updated. Please try again',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating school!',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async updateSchool(@Param('id') id: string, @Body() data: UpdateSchoolDto) {
    return await this.schoolService.updateSchool(id, data);
  }

  @Get('/dzongkhag/:dzongkhagId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'School Id invalid. Please try again',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error while fetching school by dzongkhag ID!',
  })
  async getSchoolByDzongkhag(
    @Param('dzongkhagId', ParseUUIDPipe) dzongkhagId: string,
  ) {
    return await this.schoolService.getSchoolByDzongkhag(dzongkhagId);
  }

  @Get('/:schoolId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'Invalid school ID. Please try again',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async getSchoolById(@Param('schoolId', ParseUUIDPipe) schoolId: string) {
    return await this.schoolService.getSchoolById(schoolId);
  }

  @Get('/')
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please try again',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching school',
  })
  async getAllSchool() {
    return await this.schoolService.getAllSchool();
  }
}
