import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

import * as helmet from 'helmet';
import { AllExceptionsFilter } from './helper/all-exceptions.filter'
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //error handler
  app.useGlobalFilters(new AllExceptionsFilter());

  //security
  app.use(helmet());
  app.enableCors();

  //swagger docs
  const options = new DocumentBuilder()
    .setTitle('Wemo API')
    .setDescription('demo APIs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
