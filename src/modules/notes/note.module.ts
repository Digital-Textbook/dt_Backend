import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Textbook } from '../textbook/entities/textbook.entity';
import { Users } from '../user/entities/users.entity';
import { Notes } from './entities/note.entities';
import { NoteService } from './service/note.service';
import { NoteController } from './controller/note.controller';
import { UserAuthGuard } from '../guard/user-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Notes, Textbook, Users])],
  providers: [NoteService, UserAuthGuard, JwtService],
  controllers: [NoteController],
})
export class NoteModule {}
