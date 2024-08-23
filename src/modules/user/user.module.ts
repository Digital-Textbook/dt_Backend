import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from '../student/entities/students.entity';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from './entities/UserProfile.entity';
import { UserController } from './controller/users.controller';
import { UserProfileController } from './controller/UserProfile.controller';
import { StudentController } from '../student/controller/students.controller';
import { UserService } from './service/users.service';
import { StudentProfileService } from './service/UserProfile.service';
import { StudentService } from '../student/service/students.service';
import { OtpEntity } from './entities/otp.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, Students, UserProfile, OtpEntity]),
  ],
  controllers: [UserController, UserProfileController, StudentController],
  providers: [UserService, StudentProfileService, StudentService],
})
export class UserModule {}
