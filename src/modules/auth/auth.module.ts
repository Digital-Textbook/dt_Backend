import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../admin/entities/admin.entity';
import { Students } from '../student/entities/students.entity';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from '../user/entities/UserProfile.entity';
import { StudentService } from '../student/service/students.service';
import { StudentController } from '../student/controller/students.controller';
import { UserController } from '../user/controller/users.controller';
import { UserService } from '../user/service/users.service';
import { StudentProfileService } from '../user/service/UserProfile.service';
import { AdminService } from '../admin/service/admin.service';
import { AdminController } from '../admin/controller/admin.controller';
import { UserProfileController } from '../user/controller/UserProfile.controller';
// import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
// import { AuthController } from './controller/auth.controller';
import { OtpEntity } from '../user/entities/otp.entity';
import { HttpModule } from '@nestjs/axios';
import { DataHubApiService } from '../user/service/datahub.service';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([Admin, Users, Students, UserProfile, OtpEntity]),
  ],
  controllers: [
    StudentController,
    UserController,
    AdminController,
    UserProfileController,
    // AuthController,
  ],
  providers: [
    StudentService,
    UserService,
    StudentProfileService,
    AdminService,
    // AuthService,
    // JwtStrategy,
    DataHubApiService,
  ],

  exports: [
    // JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
