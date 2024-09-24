import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookmarkService } from '../service/bookmark.service';
import { CreateBookmarkDto } from '../dto/bookmark.dto';

@ApiTags('bookmark')
@Controller('digital-textbook/bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'Bookmark successfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid data for creating bookmark!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while creating bookmark',
  })
  @ApiNotFoundResponse({ description: 'User or textbook not found!' })
  async createBookmark(@Body() data: CreateBookmarkDto) {
    return await this.bookmarkService.createBookmark(data);
  }

  @Patch(':id/:pageNumber')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark updated successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid bookmark ID!' })
  @ApiNotFoundResponse({ description: 'Bookmark not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while updating bookmark details!',
  })
  async updateBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('pageNumber') pageNumber: string,
  ) {
    return await this.bookmarkService.updateBookmark(id, pageNumber);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark deleted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid bookmark Id!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while deleting bookmark',
  })
  async deleteBookmark(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bookmarkService.deleteBookmark(id);
  }

  @Get('/:userId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark of user found successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid Bookmark Id!' })
  @ApiNotFoundResponse({ description: 'Bookmark not found!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching bookmark by User ID!',
  })
  async getBookmarkByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.bookmarkService.getBookmarkByUserId(userId);
  }

  @Get('/')
  @ApiOkResponse({ description: 'Bookmark fecthed successfully!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching bookmarks!',
  })
  async getAllBookmark() {
    return await this.bookmarkService.getAllBookmark();
  }

  @Get('/:id/bookmark-details')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark fecthed successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid Id!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching bookmarks!',
  })
  async getBookmarkById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bookmarkService.getBookmarkById(id);
  }
}
