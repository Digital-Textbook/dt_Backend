import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      const { accessTime, endTime, userId, textbookId } = data;

      const start = new Date(accessTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid start or end time provided');
      }

      const totalTime = Math.floor((end.getTime() - start.getTime()) / 1000);

      const [user, textbook] = await Promise.all([
        this.userRepository.findOne({ where: { id: userId } }),
        this.textbookRepository.findOne({ where: { id: textbookId } }),
      ]);
      if (!user || !textbook) {
        throw new NotFoundException('Invalid user or textbook ID provided');
      }

      const newScreenTime = this.screenTimeRepository.create({
        accessTime: start,
        endTime: end,
        totalTime,
        user,
        textbook,
      });

      const result = await this.screenTimeRepository.save(newScreenTime);
      if (!result) {
        throw new InternalServerErrorException(
          'Internal server error while creating screen time!',
        );
      }
      return newScreenTime;
    } catch (error) {
      console.error('Error creating bookmark: ', error);
      throw new HttpException(
        'Failed to create bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
