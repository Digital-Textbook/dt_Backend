import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateSubjectHandler } from './commands/create-subject.command';
import { SubjectController } from './subject.controller';
import { SubjectEntity } from './subject.entity';
import { SubjectService } from './subject.service';

const handlers = [CreateSubjectHandler];

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectService, ...handlers],
  controllers: [SubjectController],
})
export class SubjectModule {}
