import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NoteService } from '../service/note.service';
import { CreateNoteDto } from '../dto/note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Controller('Digital-textbook/notes')
@ApiTags('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post('/:userId')
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: 'Notes successfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid data for notes!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while creating notes!',
  })
  @ApiNotFoundResponse({ description: 'User Id invalid!' })
  async createNote(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() noteData: CreateNoteDto,
  ) {
    return await this.noteService.createNote(userId, noteData);
  }

  @Get('/textbook/:textbookId')
  @ApiOkResponse({ description: 'Notes successfully found!' })
  @ApiBadRequestResponse({ description: 'Invalid textbook Id!' })
  @ApiNotFoundResponse({ description: 'Textbook not found!' })
  async getNoteByTextbookId(@Param('textbookId') textbookId: string) {
    return await this.noteService.getNoteByTextbookId(textbookId);
  }

  @Patch('/textbook/:noteId')
  @ApiOkResponse({ description: 'Notes successfully updated!' })
  @ApiBadRequestResponse({ description: 'Invalid Note Id!' })
  @ApiNotFoundResponse({ description: 'Notes not found! ' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while updating notes!',
  })
  async updateNotesById(
    @Param('noteId') noteId: string,
    @Body() updateNote: UpdateNoteDto,
  ) {
    return await this.noteService.updateNotesById(noteId, updateNote);
  }

  @Delete('/:noteId')
  @ApiOkResponse({ description: 'Notes successfully deleted!' })
  @ApiBadRequestResponse({ description: 'Invalid Note ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while deleting notes!',
  })
  async deleteNoteById(@Param('noteId') noteId: string) {
    return await this.noteService.deleteNoteById(noteId);
  }

  @Get('/:userId/:textbookId')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Notes successfully fetched!' })
  @ApiBadRequestResponse({ description: 'Invalid Note ID!' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error while fetching notes!',
  })
  async getNotesByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('textbookId', ParseUUIDPipe) textbookId: string,
  ) {
    return await this.noteService.getNotesByUserId(userId, textbookId);
  }
}
