import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { OpenAPIObject } from '@nestjs/swagger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			prefix: 'lend-stats',
			colors: true
		})
	});

	const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, new DocumentBuilder()
		.setTitle('Lend money from your friends')
		.setDescription('The lending statistics API description')
		.setVersion('1.0')
		.addTag('lend-statistics')
		.build());

	SwaggerModule.setup('api', app, documentFactory, {
		raw: [
			'yaml',
			'json'
		]
	});

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
