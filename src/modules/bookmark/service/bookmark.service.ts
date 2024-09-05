import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      const { pageNumber, userId, textbookId } = createBookmarkDto;

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const textbook = await this.textbookRepository.findOne({
        where: { id: textbookId },
      });

      if (!user || !textbook) {
        throw new Error('Invalid user or textbook ID provided');
      }

      const existingBookmark = await this.bookmarkRepository.findOne({
        where: {
          user: { id: userId },
          textbook: { id: textbookId },
        },
      });

      if (existingBookmark) {
        existingBookmark.pageNumber = pageNumber;
        return await this.bookmarkRepository.save(existingBookmark);
      } else {
        const newBookmark = this.bookmarkRepository.create({
          pageNumber,
          user,
          textbook,
        });

        return await this.bookmarkRepository.save(newBookmark);
      }
    } catch (error) {
      console.error('Error creating bookmark: ', error);
      throw new HttpException(
        'Failed to create bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBookmark(id: string, pageNumber: string) {
    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { id: id },
    });

    if (!existingBookmark) {
      throw new HttpException(
        'Failed to upadte bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    existingBookmark.pageNumber = pageNumber;
    await this.bookmarkRepository.save(existingBookmark);

    return { msg: 'Bookmark updated successfully!', existingBookmark };
  }

  async deleteBookmark(id: string) {
    const result = await this.bookmarkRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Bookmark with ID ${id} not found!`);
    }

    return { msg: 'Bookmark deleted successfully!' };
  }

  async getBookmarkByUserId(userId: string) {
    const userBookmark = await this.bookmarkRepository.find({
      where: {
        user: { id: userId },
      },
    });

    if (!userBookmark || userBookmark.length === 0) {
      throw new NotFoundException(`User with ID ${userId} have no bookmark!`);
    }
    return userBookmark;
  }
}
