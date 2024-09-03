import { Controller } from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BookmarkService } from '../service/bookmark.service';

@Controller('bookmark')
@ApiTags('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
}
