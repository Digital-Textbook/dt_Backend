import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectController } from './controller/subject.controller';
import { SubjectService } from './service/subject.service';
import { Class } from '../class/entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Class])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
