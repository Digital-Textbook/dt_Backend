import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';

import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BookmarkService } from '../service/bookmark.service';
import { CreateBookmarkDto } from '../dto/bookmark.dto';

@Controller('bookmark')
@ApiTags('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('/')
  @ApiOkResponse({ description: 'Bookmark successfully created!' })
  @ApiBadRequestResponse({ description: 'Bookmark cannot be created!' })
  async createBookmark(@Body() data: CreateBookmarkDto) {
    return await this.bookmarkService.createBookmark(data);
  }

  @Patch(':id/:pageNumber')
  @ApiOkResponse({ description: 'Bookmark updated successfully!' })
  @ApiBadRequestResponse({ description: 'Bookmark cannot be updated!' })
  async updateBookmark(
    @Param('id') id: string,
    @Param('pageNumber') pageNumber: string,
  ) {
    return await this.bookmarkService.updateBookmark(id, pageNumber);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Bookmark deleted successfully!' })
  @ApiBadRequestResponse({ description: 'Bookmark cannot be deleted!' })
  async deleteBookmark(@Param('id') id: string) {
    return await this.bookmarkService.deleteBookmark(id);
  }

  @Get('/:userId')
  @ApiOkResponse({ description: 'Bookmark of user found successfully!' })
  @ApiBadRequestResponse({ description: 'Bookmark not found!' })
  async getBookmarkByUserId(@Param('userId') userId: string) {
    return await this.bookmarkService.getBookmarkByUserId(userId);
  }
}
