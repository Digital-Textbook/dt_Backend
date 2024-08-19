import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/entities/admin.entity';
import { Students } from '../user/entities/students.entity';
import { Users } from '../user/entities/users.entity';
import { StudentProfile } from '../user/entities/studentProfile.entity';
import { UserController } from './controller/users.controller';
import { AdminController } from './controller/admin.controller';
import { StudentProfileController } from './controller/studentProfile.controller';
import { StudentController } from './controller/students.controller';
import { UserService } from './service/users.service';
import { AdminService } from './service/admin.service';
import { StudentProfileService } from './service/studentProfile.service';
import { StudentService } from './service/students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Users, Students, StudentProfile])],
  controllers: [
    UserController,
    AdminController,
    StudentProfileController,
    StudentController,
  ],
  providers: [UserService, AdminService, StudentProfileService, StudentService],
})
export class UserModule {}
