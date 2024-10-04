import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { School } from './entities/school.entity';
import { SchoolController } from './controller/school.controller';
import { SchoolService } from './service/school.service';
import { Dzongkhag } from './entities/dzongkhag.entity';
import { Role } from '../role/entities/role.entity';
import { Admin } from '../admin/entities/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([School, Dzongkhag, Role, Admin])],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
