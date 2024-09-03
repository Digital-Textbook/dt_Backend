import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/bookmark.entities';
import { CreateBookmarkDto } from '../dto/bookmark.dto';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
  ) {}

  async createBookmark(createBookmarkDto: CreateBookmarkDto) {
    try {
      const { notes, pages, startTime, endTime, userId, textbookId } =
        createBookmarkDto;

      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid start or end time provided');
      }

      const totalTime = Math.floor((end.getTime() - start.getTime()) / 1000);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const textbook = await this.textbookRepository.findOne({
        where: { id: textbookId },
      });

      if (!user || !textbook) {
        throw new Error('Invalid user or textbook ID provided');
      }

      const newBookmark = this.bookmarkRepository.create({
        notes,
        pages,
        startTime: start,
        endTime: end,
        totalTime,
        user,
        textbook,
      });

      await this.bookmarkRepository.save(newBookmark);
      return newBookmark;
    } catch (error) {
      console.error('Error creating bookmark: ', error);
      throw new HttpException(
        'Failed to create bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
