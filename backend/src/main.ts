import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // Ensure DB is connected and schema is synced
  const dataSource = app.get(DataSource);
  if (!dataSource.isInitialized) {
    throw new Error('Database connection failed');
  }
  await dataSource.synchronize();
  console.log('Database connected and schema synced');

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger at root level – documents all routes
  const config = new DocumentBuilder()
    .setTitle('Doctor Patient Management API')
    .setDescription('API documentation for all routes')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  console.log(`Application is running on: ${baseUrl}`);
  console.log(`Swagger UI: ${baseUrl}/api`);
  console.log(`Swagger JSON: ${baseUrl}/api-json`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
