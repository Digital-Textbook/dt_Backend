import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from './entities/UserProfile.entity';
import { UserController } from './controller/users.controller';
import { UserProfileController } from './controller/UserProfile.controller';
import { UserService } from './service/users.service';
import { StudentProfileService } from './service/UserProfile.service';
import { OtpEntity } from './entities/otp.entity';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DataHubApiService } from './service/datahub.service';

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
    TypeOrmModule.forFeature([Users, UserProfile, OtpEntity]),
  ],
  controllers: [UserController, UserProfileController],
  providers: [UserService, DataHubApiService, StudentProfileService],
})
export class UserModule {}
