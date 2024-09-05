import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ScreenTimeService } from '../service/sreen-time.service';
import { CreateScreenTimeDto } from '../dto/secreen-time.dto';

@Controller('screen-time')
@ApiTags('screen')
export class ScreenTimeController {
  constructor(private screenTimeService: ScreenTimeService) {}

  @Post('/')
  @ApiOkResponse({ description: 'Screen Time successfully created!' })
  @ApiBadRequestResponse({ description: 'Screen Time cannot be created!' })
  @ApiBody({
    description: 'To create screen time recode of user!',
    type: CreateScreenTimeDto,
  })
  async createScreenTime(@Body() data: CreateScreenTimeDto) {
    return await this.screenTimeService.createScreenTime(data);
  }
}
