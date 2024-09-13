import {
  Body,
  Controller,
  Param,
  Patch,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Post,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonService } from '../service/common.service';

@ApiTags('common')
@Controller('Digital-textbook/common')
export class CommonController {
  constructor(private commonService: CommonService) {}

  @Get('/dzongkhag/:dzongkhagName')
  @ApiOkResponse({ description: 'Dzongkhag found!' })
  @ApiBadRequestResponse({ description: 'Dzongkhag not found!' })
  async getAllDzongkhag(@Param('dzongkhagName') dzongkhagName: string) {
    return await this.commonService.getAllDzongkhag(dzongkhagName);
  }

  @Get('/school/:schoolName')
  @ApiOkResponse({ description: 'School found!' })
  @ApiBadRequestResponse({ description: 'School not found!' })
  async getAllSchool(@Param('schoolName') schoolName: string) {
    return await this.commonService.getAllSchool(schoolName);
  }

  @Get('class/:classId')
  @ApiOkResponse({ description: 'Class found!' })
  @ApiNotFoundResponse({
    description: 'Class not found or no subjects available!',
  })
  @ApiBadRequestResponse({ description: 'Invalid class ID!' })
  async getSubjectByClass(@Param('classId') classId: string) {
    return await this.commonService.getSubjectByClass(classId);
  }
}
