import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notes } from '../entities/note.entities';
import { CreateNoteDto } from '../dto/note.dto';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Notes)
    private noteRepository: Repository<Notes>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
  ) {}

  async createNote(userId: string, noteData: CreateNoteDto) {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new NotFoundException(`Invalid user with ID ${userId}`);
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
      where: { id: userId, textbook: { id: noteData.textbookId } },
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

  async getNoteByTextbookId(textbookId: string) {
    const notes = await this.noteRepository.find({
      where: { textbook: { id: textbookId } },
    });

    if (!notes || notes.length === 0) {
      throw new NotFoundException('Their is no notes for this textbook!');
    }

    return notes;
  }
}
