import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminOtp } from './entities/admin-otp.entity';
import { Admin } from './entities/admin.entity';
import { PermissionController } from './controller/permission.controller';
import { PermissionService } from './service/permission.service';
import { Permission } from './entities/permission.entity';

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
    TypeOrmModule.forFeature([Admin, AdminOtp, Permission]),
  ],
  controllers: [AdminController, PermissionController],
  providers: [AdminService, PermissionService],
})
export class AdminModule {}
