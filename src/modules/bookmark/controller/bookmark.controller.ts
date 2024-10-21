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
  UseGuards,
  Request,
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
import { BookmarkService } from '../service/bookmark.service';
import { CreateBookmarkDto } from '../dto/bookmark.dto';
import { UserAuthGuard } from 'src/modules/guard/user-auth.guard';

@ApiTags('bookmark')
@Controller('digital-textbook/bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post('/')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Bookmark successfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid data for creating bookmark!' })
  @ApiNotFoundResponse({ description: 'User or textbook not found!' })
  async createBookmark(@Request() req, @Body() data: CreateBookmarkDto) {
    const id = req.user.id;
    return await this.bookmarkService.createBookmark(id, data);
  }

  @Patch(':id/:pageNumber')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark updated successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid bookmark ID!' })
  @ApiNotFoundResponse({ description: 'Bookmark not found!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async updateBookmark(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('pageNumber') pageNumber: string,
  ) {
    return await this.bookmarkService.updateBookmark(id, pageNumber);
  }

  @Delete('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark deleted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid bookmark Id!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async deleteBookmark(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bookmarkService.deleteBookmark(id);
  }

  @Get('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Bookmark of user found successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid User Id!' })
  @ApiNotFoundResponse({ description: 'Bookmark not found!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async getBookmarkByUserId(@Request() req) {
    const id = req.user.id;
    return await this.bookmarkService.getBookmarkByUserId(id);
  }

  @Get('/all')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Bookmark fecthed successfully!' })
  @ApiNotFoundResponse({ description: 'Bookmarks not found!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async getAllBookmark() {
    return await this.bookmarkService.getAllBookmark();
  }

  @Get('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Bookmark fecthed successfully!' })
  @ApiNotFoundResponse({ description: 'Bookmarks not found!' })
  @ApiBadRequestResponse({ description: 'Invalid book Id!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async getBookmarkById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bookmarkService.getBookmarkById(id);
  }
}
