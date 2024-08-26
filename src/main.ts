// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { TransformInterceptor } from './transform.interceptor';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalInterceptors(new TransformInterceptor());

//   const options = new DocumentBuilder()
//     .setTitle('Digital Textbook')
//     .setDescription('The Digital Textbook API documentation')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup('api', app, document);

//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   console.log(`Application is running on: http://localhost:${port}/api/`);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger setup
  const options = new DocumentBuilder()
    .setTitle('Digital Textbook')
    .setDescription('The Digital Textbook API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api/`);
}

bootstrap();
