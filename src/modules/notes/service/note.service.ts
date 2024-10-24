import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notes } from '../entities/note.entities';
import { CreateNoteDto } from '../dto/note.dto';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Notes)
    private noteRepository: Repository<Notes>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
  ) {}

  async createNote(id: string, noteData: CreateNoteDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Invalid user with ID ${id}`);
    }

    const existingTextbook = await this.textbookRepository.findOne({
      where: { id: noteData.textbookId },
    });
    if (!existingTextbook) {
      throw new NotFoundException(
        `Invalid textbook with ID ${noteData.textbookId}`,
      );
    }

    const existingNotes = await this.noteRepository.findOne({
      where: { id: id, textbook: { id: noteData.textbookId } },
      relations: ['textbook', 'textbook.subject', 'textbook.subject.class'],
    });

    if (existingNotes) {
      existingNotes.pageNumber = noteData.pageNumber;
      existingNotes.notes = noteData.notes;
      return await this.noteRepository.save(existingNotes);
    } else {
      const newNotes = this.noteRepository.create({
        user: existingUser,
        pageNumber: noteData.pageNumber,
        textbook: existingTextbook,
        notes: noteData.notes,
      });

      return await this.noteRepository.save(newNotes);
    }
  }

  async updateNotesById(noteId: string, updateNote: UpdateNoteDto) {
    const notes = await this.noteRepository.findOne({
      where: { id: noteId },
    });

    if (!notes) {
      throw new NotFoundException(
        `Their is no notes for this Notes ID! ${noteId}`,
      );
    }

    notes.notes = updateNote.notes;

    const result = await this.noteRepository.save(notes);

    if (!result) {
      throw new InternalServerErrorException('Error while updating notes!');
    }

    return notes;
  }

  async deleteNoteById(noteId: string) {
    const result = await this.noteRepository.delete(noteId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Error while deleting note with ID ${noteId}`,
      );
    }
    return { msg: 'Note deleted successfully!' };
  }

  async getNotesByUserId(userId: string, textbookId: string) {
    const notes = await this.noteRepository.find({
      where: {
        user: { id: userId },
        textbook: { id: textbookId },
      },
    });

    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes for User with ID ${userId}!`);
    }

    return notes;
  }

  async getNotes(userId: string) {
    const notes = await this.noteRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['textbook'],
    });

    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes for User with ID ${userId}!`);
    }

    return notes;
  }
}
