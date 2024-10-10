import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { UserProfile } from './entities/UserProfile.entity';
import { UserController } from './controller/users.controller';
import { UserProfileController } from './controller/UserProfile.controller';
import { UserService } from './service/users.service';
import { UserProfileService } from './service/UserProfile.service';
import { OtpEntity } from './entities/otp.entity';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { DataHubApiService } from './service/datahub.service';
import { School } from '../school/entities/school.entity';
import { Dzongkhag } from '../school/entities/dzongkhag.entity';
import { CommonController } from 'src/common/controller/common.controller';
import { CommonService } from 'src/common/service/common.service';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { Class } from '../class/entities/class.entity';
import { Subject } from '../subject/entities/subject.entity';
import { AdminJwtGuard } from '../auth/guard/AdminAuthGuard';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/role.guard';
import { PermissionsGuard } from '../guard/permission.guard';

@Module({
  imports: [
    HttpModule,
    MinioClientModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'topSecret51',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([
      Users,
      UserProfile,
      OtpEntity,
      School,
      Dzongkhag,
      Class,
      Subject,
    ]),
  ],
  controllers: [UserController, UserProfileController, CommonController],
  providers: [
    UserService,
    DataHubApiService,
    UserProfileService,
    CommonService,

    AdminJwtGuard,
    AuthGuard,
    RolesGuard,
    PermissionsGuard,
  ],
})
export class UserModule {}
