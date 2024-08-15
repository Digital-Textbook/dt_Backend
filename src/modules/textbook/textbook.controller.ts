import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { Auth, UUIDParam } from '../../decorators';
import { CreateTextbookDto } from './dtos/create-textbook.dto';
import { type TextbookDto } from './dtos/textbook.dto';
import { TextbookPageOptionsDto } from './dtos/textbook-page-options.dto';
import { UpdateTextbookDto } from './dtos/update-textbook.dto';
import { TextbookService } from './textbook.service';

@Controller('textbooks')
@ApiTags('textbooks')
export class TextbookController {
  constructor(private textbookService: TextbookService) {}

  @Post()
  @Auth([])
  @HttpCode(HttpStatus.CREATED)
  async createTextbook(@Body() createTextbookDto: CreateTextbookDto) {
    const entity = await this.textbookService.createTextbook(createTextbookDto);

    return entity.toDto();
  }

  @Get()
  @Auth([])
  @HttpCode(HttpStatus.OK)
  getAllTextbook(
    @Query() textbookPageOptionsDto: TextbookPageOptionsDto,
  ): Promise<PageDto<TextbookDto>> {
    return this.textbookService.getAllTextbook(textbookPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  async getSingleTextbook(@UUIDParam('id') id: Uuid): Promise<TextbookDto> {
    const entity = await this.textbookService.getSingleTextbook(id);

    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateTextbook(
    @UUIDParam('id') id: Uuid,
    @Body() updateTextbookDto: UpdateTextbookDto,
  ): Promise<void> {
    return this.textbookService.updateTextbook(id, updateTextbookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteTextbook(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.textbookService.deleteTextbook(id);
  }
}
