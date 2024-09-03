import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/bookmark.entities';
import { CreateBookmarkDto } from '../dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
  ) {}

  async createBookmark(createBookmarkDto: CreateBookmarkDto) {
    const { notes, pages, startTime, endTime } = createBookmarkDto;

    const totalTime = BigInt(
      Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
    );

    const newBookmark = this.bookmarkRepository.create({
      notes,
      pages,
      startTime,
      endTime,
      totalTime,
    });

    await this.bookmarkRepository.save(newBookmark);
    return newBookmark;
  }
}
