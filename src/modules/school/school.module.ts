import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { School } from './entities/school.entity';
import { SchoolController } from './controller/school.controller';
import { SchoolService } from './service/school.service';
import { Dzongkhag } from './entities/dzongkhag.entity';
import { Role } from '../role/entities/role.entity';
import { Admin } from '../admin/entities/admin.entity';

import { AdminJwtGuard } from '../auth/guard/AdminAuthGuard';
import { RolesGuard } from '../guard/role.guard';
import { PermissionsGuard } from '../guard/permission.guard';
import { AuthGuard } from '../guard/auth.guard';
import { Gewog } from './entities/gewog.entities';

@Module({
  imports: [TypeOrmModule.forFeature([School, Dzongkhag, Role, Admin, Gewog])],
  controllers: [SchoolController],
  providers: [
    SchoolService,
    AdminJwtGuard,
    RolesGuard,
    PermissionsGuard,
    AuthGuard,
  ],
})
export class SchoolModule {}
