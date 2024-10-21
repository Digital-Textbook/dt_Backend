import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectController } from './controller/subject.controller';
import { SubjectService } from './service/subject.service';
import { Class } from '../class/entities/class.entity';
import { AdminJwtGuard } from '../guard/AdminAuthGuard';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/role.guard';
import { PermissionsGuard } from '../guard/permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Class])],
  controllers: [SubjectController],
  providers: [
    SubjectService,
    AdminJwtGuard,
    AuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class SubjectModule {}
