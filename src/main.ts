import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: true,
    },
  });
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //  app.enableCors({
  //   origin: 'https://win-client.vercel.app', // Your client origin
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true, // if you need to handle cookies
  // });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.use(cookieParser('MY SECRET KEY'));
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const configSwagger = new DocumentBuilder()
    .setTitle('KNOWLEDGE TEST RESTfull API Documentation ')
    .setDescription('FULL STACK ENGINEER PT WIDYA INFORMASI NUSANTARA')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'access_token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'refresh_token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(configService.get('PORT'));
}

bootstrap();
