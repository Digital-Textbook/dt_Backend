import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookmarkService } from '../service/bookmark.service';
import { CreateBookmarkDto } from '../dto/bookmark.dto';

@Controller('bookmark')
@ApiTags('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('/')
  async createBookmark(@Body() data: CreateBookmarkDto) {
    return await this.bookmarkService.createBookmark(data);
  }

  @Patch(':id/:pageNumber')
  async updateBookmark(
    @Param('id') id: string,
    @Param('pageNumber') pageNumber: string,
  ) {
    return await this.bookmarkService.updateBookmark(id, pageNumber);
  }

  @Delete('/:id')
  async deleteBookmark(@Param('id') id: string) {
    return await this.bookmarkService.deleteBookmark(id);
  }

  @Get('/:userId')
  async getBookmarkByUserId(@Param('userId') userId: string) {
    return await this.bookmarkService.getBookmarkByUserId(userId);
  }
}
