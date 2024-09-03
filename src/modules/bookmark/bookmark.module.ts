import { Module } from '@nestjs/common';
import { BookmarkService } from './service/bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entities';
import { BookmarkController } from './controller/bookmark.controller';
import { Textbook } from '../textbook/entities/textbook.entity';
import { Users } from '../user/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Textbook, Users])],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
