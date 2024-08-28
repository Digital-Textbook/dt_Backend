import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../../user/entities/users.entity';

@Injectable()
export class AuthService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}
}
