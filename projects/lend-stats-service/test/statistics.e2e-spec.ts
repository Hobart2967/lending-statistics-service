/* eslint-disable @typescript-eslint/init-declarations */
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import {
	LendingStatsProcessQueueService
} from '../src/queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { UpdateProcessType } from '../src/models/update-process-type';
import { seed } from './seed.e2e-util';

describe('Statistics Update Controller (e2e)', () => {
	const context = {};
	let app: INestApplication<App>;

	seed(context, async () => {
		const moduleFixture: TestingModule = await Test
			.createTestingModule({
				imports: [AppModule]
			})
			.compile();

		app = moduleFixture.createNestApplication();

		await app.init();

		return app;
	});

	it('/ (GET)', async () => {
		const result = await request(app.getHttpServer())
			.post('/stats')
			.send({
				processType: UpdateProcessType.UpdateLoanLimit
			})
			.expect(201);

		const queue = app.get(LendingStatsProcessQueueService);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			const status = await queue.getQueueStatus();
			if (status.total) {
				await new Promise(resolve => setTimeout(resolve, 100));
				continue;
			}

			break;
		}

		return result;
	});
});
