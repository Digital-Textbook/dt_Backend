import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { SubjectModule } from './modules/subject/subject.module';
import { SchoolModule } from './modules/school/school.module';
import { MinioClientModule } from './minio-client/minio-client.module';
import { TextbookModule } from './modules/textbook/textbook.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';
import { NoteModule } from './modules/notes/note.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AdminModule,
    PassportModule,
    SubjectModule,
    SchoolModule,
    MinioClientModule,
    NoteModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'),
          port: configService.get<number>('EMAIL_PORT'),
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_USER'),
            pass: configService.get<string>('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"Digital Textbook" <${configService.get<string>('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../src/template'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    TextbookModule,
    BookmarkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
