import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../user/entities/admin.entity';
import { Students } from '../user/entities/students.entity';
import { Users } from '../user/entities/users.entity';
import { StudentProfile } from '../user/entities/studentProfile.entity';
import { StudentService } from '../user/service/students.service';
import { StudentController } from '../user/controller/students.controller';
import { UserController } from '../user/controller/users.controller';
import { UserService } from '../user/service/users.service';
import { StudentProfileService } from '../user/service/studentProfile.service';
import { AdminService } from '../user/service/admin.service';
import { AdminController } from '../user/controller/admin.controller';
import { StudentProfileController } from '../user/controller/studentProfile.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controller/auth.controller';
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([Admin, Users, Students, StudentProfile]),
  ],
  controllers: [
    StudentController,
    UserController,
    AdminController,
    StudentProfileController,
    AuthController,
  ],
  providers: [
    StudentService,
    UserService,
    StudentProfileService,
    AdminService,
    AuthService,
    JwtStrategy,
  ],

  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
