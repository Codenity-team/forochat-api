import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Garage API')
        .setDescription('Documentation of Garage API, CAR SHOP')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    const cors = {
        origin: [
            'http://localhost:4200',
            '*',
        ],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders: [
            'Accept',
            'Content-Type',
            'Authorization',
            'token',
        ],
    };
    app.enableCors(cors);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    await app.listen(3000);
}
bootstrap();