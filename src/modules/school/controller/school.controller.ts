import {
  Controller,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Get,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SchoolService } from '../service/school.service';
import { CreateSchoolDto } from '../dto/school.dto';
import { UpdateSchoolDto } from '../dto/updateSchool.dto';

import { Permissions, Roles } from 'src/modules/guard/roles.decorator';
import { AuthGuard } from 'src/modules/guard/auth.guard';

@ApiTags('school')
@Controller('digital-textbook/school')
export class SchoolController {
  constructor(private schoolService: SchoolService) {}

  @Post('/')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'Super Admin')
  @Permissions('create')
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'School creacted successfully!' })
  @ApiNotFoundResponse({ description: 'Dzongkhag Id is invalid!' })
  @ApiUnauthorizedResponse({
    description: 'User does not have permission to create school!',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to create school!',
  })
  async addSubject(@Body() data: CreateSchoolDto) {
    return await this.schoolService.addSchool(data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'Super Admin')
  @Permissions('delete')
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'School delete successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid School ID!' })
  @ApiNotFoundResponse({
    description: 'School not found in database!',
  })
  async deleteSubject(@Param('id', ParseUUIDPipe) id: string) {
    return await this.schoolService.deleteSchool(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  @Roles('Admin', 'Super Admin')
  @Permissions('update')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'School updated successfully!' })
  @ApiBadRequestResponse({
    description: 'Invalid data. Please check input data',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async updateSchool(@Param('id') id: string, @Body() data: UpdateSchoolDto) {
    return await this.schoolService.updateSchool(id, data);
  }

  @Get('/dzongkhag/:dzongkhagId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'School Id invalid. Please check input data',
  })
  @ApiNotFoundResponse({
    description: 'School not found by dzongkhag ID!',
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
    description: 'Invalid school ID. Please check input data',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async getSchoolById(@Param('schoolId', ParseUUIDPipe) schoolId: string) {
    return await this.schoolService.getSchoolById(schoolId);
  }

  @Get('/')
  @ApiOkResponse({ description: 'School successfully found.' })
  @ApiBadRequestResponse({
    description: 'Invalid school ID. Please check input data!',
  })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async getAllSchool() {
    return await this.schoolService.getAllSchool();
  }
}
