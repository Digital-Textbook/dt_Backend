import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Get,
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
import { NoteService } from '../service/note.service';
import { CreateNoteDto } from '../dto/note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { UserAuthGuard } from 'src/modules/guard/user-auth.guard';

@ApiTags('notes')
@Controller('digital-textbook/notes')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Post('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Notes successfully created!' })
  @ApiBadRequestResponse({ description: 'Invalid data for notes!' })
  @ApiNotFoundResponse({ description: 'User Id invalid!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async createNote(@Request() req, @Body() noteData: CreateNoteDto) {
    const id = req.user.id;
    console.log('User token::', id);
    return await this.noteService.createNote(id, noteData);
  }

  @Patch('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Notes successfully updated!' })
  @ApiBadRequestResponse({ description: 'Invalid Note Id!' })
  @ApiNotFoundResponse({ description: 'Notes not found! ' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async updateNotesById(
    @Param('id') id: string,
    @Body() updateNote: UpdateNoteDto,
  ) {
    return await this.noteService.updateNotesById(id, updateNote);
  }

  @Delete('/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Notes successfully deleted!' })
  @ApiBadRequestResponse({ description: 'Invalid Note ID!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async deleteNoteById(@Param('id') id: string) {
    return await this.noteService.deleteNoteById(id);
  }

  @Get('')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Notes successfully fetched!' })
  @ApiBadRequestResponse({ description: 'Invalid Note ID!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async getNotes(@Request() req) {
    const id = req.user.id;
    return await this.noteService.getNotes(id);
  }

  @Get('/:textbookId')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Notes successfully fetched!' })
  @ApiBadRequestResponse({ description: 'Invalid Note ID!' })
  @ApiUnauthorizedResponse({
    description:
      'The user is not authorized (e.g., missing or invalid authentication token).',
  })
  async getNotesByUserId(
    @Request() req,
    @Param('textbookId', ParseUUIDPipe) textbookId: string,
  ) {
    const id = req.user.id;
    return await this.noteService.getNotesByUserId(id, textbookId);
  }
}
