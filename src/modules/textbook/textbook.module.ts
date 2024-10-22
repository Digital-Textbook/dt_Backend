import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Textbook } from './entities/textbook.entity';
import { TextbookController } from './controller/textbook.controller';
import { TextbookService } from './service/textbook.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { Subject } from '../subject/entities/subject.entity';
import { Bookmark } from '../bookmark/entities/bookmark.entities';
import { Notes } from '../notes/entities/note.entities';
import { ScreenTime } from '../bookmark/entities/screen-time.entities';
import { Auth } from '../guard/auth.guard';
import { AdminJwtGuard } from '../guard/AdminAuthGuard';
import { RolesGuard } from '../guard/role.guard';
import { PermissionsGuard } from '../guard/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Textbook, Subject, Bookmark, Notes, ScreenTime]),
    MinioClientModule,
  ],
  controllers: [TextbookController],
  providers: [
    TextbookService,
    AdminJwtGuard,
    Auth,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class TextbookModule {}
