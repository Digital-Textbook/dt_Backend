import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Textbook } from './entities/textbook.entity';
import { TextbookController } from './controller/textbook.controller';
import { TextbookService } from './service/textbook.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Textbook, Subject]), MinioClientModule],
  controllers: [TextbookController],
  providers: [TextbookService],
})
export class TextbookModule {}
