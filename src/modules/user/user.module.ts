import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../user/entities/admin.entity';
import { Students } from '../user/entities/students.entity';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from './entities/UserProfile.entity';
import { UserController } from './controller/users.controller';
import { AdminController } from './controller/admin.controller';
import { UserProfileController } from './controller/UserProfile.controller';
import { StudentController } from './controller/students.controller';
import { UserService } from './service/users.service';
import { AdminService } from './service/admin.service';
import { StudentProfileService } from './service/UserProfile.service';
import { StudentService } from './service/students.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Users, Students, UserProfile])],
  controllers: [
    UserController,
    AdminController,
    UserProfileController,
    StudentController,
  ],
  providers: [UserService, AdminService, StudentProfileService, StudentService],
})
export class UserModule {}
