import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dto/createUser.dto';
import { Students } from '../entities/students.entity';
import { UserProfile } from '../entities/UserProfile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private saltRounds = 10;
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Students) private studentRepository: Repository<Students>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {}

  async getAllUsers(): Promise<Users[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async createNewUser(user: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { cid_no: user.cid_no },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with this CID already exists: ${user.cid_no}`,
      );
    }

    const existingUserByMobile = await this.usersRepository.findOne({
      where: { mobile_no: user.mobile_no },
    });

    if (existingUserByMobile) {
      throw new ConflictException(
        `This phone number is already taken: ${user.mobile_no}`,
      );
    }

    const existingUserByStudentCode = await this.usersRepository.findOne({
      where: { student_code: user.student_code },
    });

    if (existingUserByStudentCode) {
      throw new ConflictException(
        `User with this student code already exists: ${user.student_code}`,
      );
    }

    const student = await this.getStudentByCid(user.cid_no);

    if (student) {
      const hashedPassword = await bcrypt.hash(user.password, this.saltRounds);

      let newUser = this.usersRepository.create({
        ...user,
        password: hashedPassword,
        status: 'active',
      });

      const savedUser = await this.usersRepository.save(newUser);

      const newProfile = this.userProfileRepository.create({
        user: savedUser,
        name: student.name,
        student_code: student.student_code,
        class: student.class,
        school: student.school,
        dzongkhag: student.dzongkhag,
        mobile_no: user.mobile_no,
      });

      const savedProfile = await this.userProfileRepository.save(newProfile);

      savedUser.profile = savedProfile;
      await this.usersRepository.save(savedUser);

      return savedUser;
    } else {
      throw new NotFoundException(
        `No matching student data found for the provided CID No: ${user.cid_no}`,
      );
    }
  }

  async getStudentByCid(cid_no: string): Promise<Students> {
    if (!cid_no) {
      throw new Error('CID No is required');
    }

    const student = await this.studentRepository.findOne({
      where: { cid_no },
    });

    if (!student) {
      throw new NotFoundException(
        `No matching student data found for the provided CID No: ${cid_no}`,
      );
    }

    return student;
  }

  async getUserByCid(cid_no: string): Promise<Users> {
    if (!cid_no) {
      throw new Error('CID No is required');
    }

    const user = await this.usersRepository.findOne({
      where: { cid_no },
    });

    if (!user) {
      throw new NotFoundException('No matching data found');
    }

    return user;
  }
}
