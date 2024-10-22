import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ScreenTimeService } from '../service/sreen-time.service';
import { CreateScreenTimeDto } from '../dto/secreen-time.dto';
import { UserAuthGuard } from 'src/modules/guard/user-auth.guard';

@ApiTags('screen')
@Controller('digital-textbook/screen-time')
export class ScreenTimeController {
  constructor(private screenTimeService: ScreenTimeService) {}

  @Post('/')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Screen Time successfully created!' })
  @ApiBadRequestResponse({
    description: ' A request with invalid parameters!',
  })
  @ApiNotFoundResponse({ description: 'User or textbook not found!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async createScreenTime(@Request() req, @Body() data: CreateScreenTimeDto) {
    const id = req.user.id;
    return await this.screenTimeService.createScreenTime(id, data);
  }

  @Get('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Screen time successfully fetched!' })
  async getDailyScreenTime(@Param('id', ParseUUIDPipe) id: string) {
    return await this.screenTimeService.getDailyScreenTime(id);
  }
}
