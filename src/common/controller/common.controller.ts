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
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommonService } from '../service/common.service';

@ApiTags('common')
@Controller('common')
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
}
