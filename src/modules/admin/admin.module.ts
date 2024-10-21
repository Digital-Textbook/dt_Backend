import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AdminOtp } from './entities/admin-otp.entity';
import { Admin } from './entities/admin.entity';
import { RoleService } from '../role/service/role.service';
import { Role } from '../role/entities/role.entity';
import { RoleController } from '../role/controller/role.controller';
import { PermissionService } from '../permission/service/permission.service';
import { PermissionController } from '../permission/controller/permission.controller';
import { Permission } from '../permission/entities/permission.entity';

import { AdminJwtGuard } from '../guard/AdminAuthGuard';
import { RolesGuard } from '../guard/role.guard';
import { PermissionsGuard } from '../guard/permission.guard';
import { AuthGuard } from '../guard/auth.guard';

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
    TypeOrmModule.forFeature([Admin, AdminOtp, Role, Permission]),
  ],
  controllers: [AdminController, RoleController, PermissionController],
  providers: [
    AdminService,
    RoleService,
    PermissionService,

    AdminJwtGuard,
    RolesGuard,
    PermissionsGuard,
    AuthGuard,
  ],
})
export class AdminModule {}
