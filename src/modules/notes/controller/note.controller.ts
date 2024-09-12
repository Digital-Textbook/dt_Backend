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
import { NoteService } from '../service/note.service';
import { CreateNoteDto } from '../dto/note.dto';

@Controller('Digital-textbook/notes')
@ApiTags('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post('/:userId')
  @ApiOkResponse({ description: 'Notes successfully created!' })
  @ApiBadRequestResponse({ description: 'Notes cannot be created!' })
  async createNote(
    @Param('userId') userId: string,
    @Body() noteData: CreateNoteDto,
  ) {
    return await this.noteService.createNote(userId, noteData);
  }

  @Get('/textbook/:textbookId')
  @ApiOkResponse({ description: 'Notes successfully found!' })
  @ApiBadRequestResponse({ description: 'Notes not found!' })
  async getNoteByTextbookId(@Param('textbookId') textbookId: string) {
    return await this.noteService.getNoteByTextbookId(textbookId);
  }
}
