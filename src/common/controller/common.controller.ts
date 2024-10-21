import {
  Controller,
  Param,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonService } from '../service/common.service';

@ApiTags('common')
@Controller('digital-textbook/common')
export class CommonController {
  constructor(private commonService: CommonService) {}

  @Get('/dzongkhag/:dzongkhagName')
  @ApiOkResponse({ description: 'Dzongkhag found!' })
  @ApiNotFoundResponse({ description: 'Dzongkhag not found!' })
  async getAllDzongkhag(@Param('dzongkhagName') dzongkhagName: string) {
    return await this.commonService.getAllDzongkhag(dzongkhagName);
  }

  @Get('/school/:schoolName')
  @ApiOkResponse({ description: 'School found!' })
  @ApiNotFoundResponse({ description: 'School not found!' })
  async getAllSchool(@Param('schoolName') schoolName: string) {
    return await this.commonService.getAllSchool(schoolName);
  }

  @Get('class/:classId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Class found!' })
  @ApiNotFoundResponse({
    description: 'Class not found or no subjects available!',
  })
  @ApiBadRequestResponse({ description: 'Invalid class ID!' })
  async getSubjectByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return await this.commonService.getSubjectByClass(classId);
  }

  @Get('/subject')
  @ApiOkResponse({ description: 'Subject found!' })
  @ApiNotFoundResponse({ description: 'Subject not found!' })
  async getAllSubject() {
    return await this.commonService.getAllSubject();
  }

  @Get('/dzongkhag')
  @ApiOkResponse({ description: 'Dzongkhag found!' })
  @ApiNotFoundResponse({ description: 'Dzongkhag not found!' })
  async getDzongkhag() {
    return await this.commonService.getDzongkhag();
  }

  @Get('/dashboard')
  @ApiOkResponse({ description: 'Dashboard item found!' })
  @ApiNotFoundResponse({ description: 'Dashboard item not found!' })
  async getDashboard() {
    return await this.commonService.getDashboardItem();
  }
}
