import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Admin } from '../admin/entities/admin.entity';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from '../user/entities/UserProfile.entity';
import { UserController } from '../user/controller/users.controller';
import { UserService } from '../user/service/users.service';
import { AdminService } from '../admin/service/admin.service';
import { AdminController } from '../admin/controller/admin.controller';
import { AuthService } from './service/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { OtpEntity } from '../user/entities/otp.entity';
import { HttpModule } from '@nestjs/axios';
import { DataHubApiService } from '../user/service/datahub.service';
import { AdminOtp } from '../admin/entities/admin-otp.entity';

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
    TypeOrmModule.forFeature([Admin, Users, UserProfile, OtpEntity, AdminOtp]),
  ],
  controllers: [UserController, AdminController, AuthController],
  providers: [
    UserService,
    AdminService,
    AuthService,
    JwtStrategy,
    DataHubApiService,
  ],

  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
