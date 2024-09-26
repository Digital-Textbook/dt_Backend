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
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { Role } from './entities/role.entity';

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
    TypeOrmModule.forFeature([Admin, AdminOtp, Permission, Role]),
  ],
  controllers: [AdminController, PermissionController, RoleController],
  providers: [AdminService, PermissionService, RoleService],
})
export class AdminModule {}
