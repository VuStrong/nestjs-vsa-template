import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/global.exception-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new GlobalExceptionFilter());

    // API Versioning
    app.enableVersioning({
        type: VersioningType.URI,
    });

    // Swagger
    const appName = process.env.APP_NAME;
    const swaggerConfig = new DocumentBuilder()
        .setTitle(`${appName} API`)
        .setDescription(`API documentation for ${appName} Backend`)
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, documentFactory);

    // CORS
    app.enableCors({
        origin: "*",
        methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    });

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
