import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScreenTimeService } from '../service/sreen-time.service';
import { CreateScreenTimeDto } from '../dto/secreen-time.dto';

@ApiTags('screen')
@Controller('digital-textbook/screen-time')
export class ScreenTimeController {
  constructor(private screenTimeService: ScreenTimeService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'Screen Time successfully created!' })
  @ApiBadRequestResponse({
    description: 'Invalid data for creating screen time!!',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while creating screen time!',
  })
  @ApiNotFoundResponse({ description: 'User or textbook not found!' })
  @ApiBody({
    description: 'To create screen time recode of user!',
    type: CreateScreenTimeDto,
  })
  async createScreenTime(@Body() data: CreateScreenTimeDto) {
    return await this.screenTimeService.createScreenTime(data);
  }
}
