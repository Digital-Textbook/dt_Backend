import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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

      const [user, textbook, existingBookmark] = await Promise.all([
        this.userRepository.findOne({ where: { id: userId } }),
        this.textbookRepository.findOne({ where: { id: textbookId } }),
        this.bookmarkRepository.findOne({
          where: { user: { id: userId }, textbook: { id: textbookId } },
        }),
      ]);

      if (!user || !textbook) {
        throw new NotFoundException('Invalid user or textbook ID provided');
      }

      if (existingBookmark && existingBookmark.isBookmark === true) {
        existingBookmark.pageNumber = pageNumber;
        return await this.bookmarkRepository.save(existingBookmark);
      } else {
        const newBookmark = this.bookmarkRepository.create({
          pageNumber,
          user,
          textbook,
          isBookmark: true,
        });
        const result = await this.bookmarkRepository.save(newBookmark);
        if (!result) {
          throw new InternalServerErrorException(
            'Internal server error while creating bookmark',
          );
        }
        return newBookmark;
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
      throw new NotFoundException('Bookmark not found!');
    }

    existingBookmark.pageNumber = pageNumber;
    const result = this.bookmarkRepository.save(existingBookmark);

    if (!result) {
      throw new InternalServerErrorException(
        'Internal server error while updating bookmark!',
      );
    }

    return { msg: 'Bookmark updated successfully!', existingBookmark };
  }

  async deleteBookmark(id: string) {
    const result = await this.bookmarkRepository.delete(id);

    if (result.affected === 0) {
      throw new InternalServerErrorException(
        `Bookmark with ID ${id} not found!`,
      );
    }

    return { msg: 'Bookmark deleted successfully!' };
  }

  //   async getBookmarkByUserId(userId: string) {
  //     const userBookmark = await this.bookmarkRepository.find({
  //       where: {
  //         user: { id: userId },
  //       },
  //       relations: ['textbook', 'textbook.subject'],
  //       select: ['pageNumber', 'textbook.coverUrl', 'textbook.textbookUrl', 'subject.subjectName']
  //     });

  //     if (!userBookmark || userBookmark.length === 0) {
  //       throw new NotFoundException(`User with ID ${userId} have no bookmark!`);
  //     }
  //     return {

  //     };
  //   }

  async getBookmarkByUserId(userId: string) {
    const userBookmarks = await this.bookmarkRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['textbook', 'textbook.subject'],
    });

    if (!userBookmarks || userBookmarks.length === 0) {
      throw new NotFoundException(`User with ID ${userId} has no bookmarks!`);
    }

    const bookmarks = userBookmarks.map((bookmark) => ({
      pageNumber: bookmark.pageNumber,
      textbookCoverUrl: bookmark.textbook.coverUrl,
      textbookUrl: bookmark.textbook.textbookUrl,
      subjectName: bookmark.textbook.subject.subjectName,
    }));

    return bookmarks;
  }

  async getAllBookmark() {
    const bookmarks = await this.bookmarkRepository.find();

    if (!bookmarks || bookmarks.length === 0) {
      throw new NotFoundException('Bookmarks not found!');
    }

    return bookmarks;
  }

  async getBookmarkById(id: string) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id: id },
      relations: ['textbook', 'textbook.subject'],
    });
    if (!bookmark || bookmark.isBookmark === true) {
      throw new NotFoundException(`Bookmark with ID ${id} not found!`);
    }
    const subjectName = bookmark.textbook?.subject?.subjectName || 'N/A';
    const coverUrl = bookmark.textbook?.coverUrl || 'N/A';

    return {
      id: bookmark.id,
      subjectName: subjectName,
      pageNumber: bookmark.pageNumber,
      coverUrl: coverUrl,
    };
  }
}
