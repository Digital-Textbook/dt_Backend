import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Textbook } from './entities/textbook.entity';
import { TextbookController } from './controller/textbook.controller';
import { TextbookService } from './service/textbook.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Textbook]), MinioClientModule],
  controllers: [TextbookController],
  providers: [TextbookService],
})
export class TextbookModule {}
