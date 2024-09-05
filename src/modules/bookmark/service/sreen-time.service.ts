import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/modules/user/entities/users.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';
import { ScreenTime } from '../entities/screen-time.entities';
import { CreateScreenTimeDto } from '../dto/secreen-time.dto';

@Injectable()
export class ScreenTimeService {
  constructor(
    @InjectRepository(ScreenTime)
    private screenTimeRepository: Repository<ScreenTime>,
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Textbook)
    private textbookRepository: Repository<Textbook>,
  ) {}

  async createScreenTime(data: CreateScreenTimeDto) {
    try {
      console.log('Data: ', data);
      const { accessTime, endTime, userId, textbookId } = data;

      const start = new Date(accessTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid start or end time provided');
      }

      const totalTime = Math.floor((end.getTime() - start.getTime()) / 1000);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      const textbook = await this.textbookRepository.findOne({
        where: { id: textbookId },
      });

      console.log('User: ', user);
      console.log('Textbook: ', textbook);

      if (!user || !textbook) {
        throw new Error('Invalid user or textbook ID provided');
      }

      const newScreenTime = this.screenTimeRepository.create({
        accessTime: start,
        endTime: end,
        totalTime,
        user,
        textbook,
      });

      return await this.screenTimeRepository.save(newScreenTime);
    } catch (error) {
      console.error('Error creating bookmark: ', error);
      throw new HttpException(
        'Failed to create bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
