import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalInterceptors(new TransformInterceptor());

  const options = new DocumentBuilder()
    .setTitle('Digital Textbook')
    .setDescription('The Digital Textbook API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(
    session({
      secret: 'topSecret51',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/`);
}

bootstrap();
