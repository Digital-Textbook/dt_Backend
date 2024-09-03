import { Controller, Post, Body } from '@nestjs/common';

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
}
