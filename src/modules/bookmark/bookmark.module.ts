import { Module } from '@nestjs/common';
import { BookmarkService } from './service/bookmark.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entities';
import { BookmarkController } from './controller/bookmark.controller';
import { Textbook } from '../textbook/entities/textbook.entity';
import { Users } from '../user/entities/users.entity';
import { ScreenTime } from './entities/screen-time.entities';
import { ScreenTimeService } from './service/sreen-time.service';
import { ScreenTimeController } from './controller/screen-time.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Textbook, Users, ScreenTime])],
  providers: [BookmarkService, ScreenTimeService],
  controllers: [BookmarkController, ScreenTimeController],
})
export class BookmarkModule {}
