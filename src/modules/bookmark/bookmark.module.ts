import { Module } from '@nestjs/common';
import { BookmarkService } from './service/bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entities';
import { BookmarkController } from './controller/bookmark.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark])],
  providers: [BookmarkService],
  controllers: [BookmarkController],
})
export class BookmarkModule {}
