import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminOtp } from './entities/admin-otp.entity';
import { Admin } from './entities/admin.entity';

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
    TypeOrmModule.forFeature([Admin, AdminOtp]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
