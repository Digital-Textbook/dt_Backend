import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './controller/common.controller';
import { CommonService } from './service/common.service';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { Subject } from 'src/modules/subject/entities/subject.entity';
import { Textbook } from 'src/modules/textbook/entities/textbook.entity';
import { Users } from 'src/modules/user/entities/users.entity';
import { School } from 'src/modules/school/entities/school.entity';
import { Dzongkhag } from 'src/modules/school/entities/dzongkhag.entity';
import { Class } from 'src/modules/class/entities/class.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Role,
      Permission,
      Subject,
      Textbook,
      Users,
      School,
      Dzongkhag,
      Class,
    ]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
