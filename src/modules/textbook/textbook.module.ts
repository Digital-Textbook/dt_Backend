import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateTextbookHandler } from './commands/create-textbook.command';
import { TextbookController } from './textbook.controller';
import { TextbookEntity } from './textbook.entity';
import { TextbookService } from './textbook.service';

const handlers = [CreateTextbookHandler];

@Module({
  imports: [TypeOrmModule.forFeature([TextbookEntity])],
  providers: [TextbookService, ...handlers],
  controllers: [TextbookController],
})
export class TextbookModule {}
