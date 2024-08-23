import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from '../student/entities/students.entity';
import { StudentController } from './controller/students.controller';
import { StudentService } from './service/students.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Students])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
