/* eslint-disable @typescript-eslint/init-declarations */

import { UpdateStatisticsController } from './update-statistics.controller';
import { UpdateProcessType } from '../models/update-process-type';
import { It, Mock } from 'moq.ts';
import type {
	LendingStatsProcessQueueService
} from '../queues/lending-stats-process-queue/lending-stats-process-queue.service';
import type { QueueJobRequest } from '../models/queue-job-request';

describe('AppController', () => {
	let appController!: UpdateStatisticsController;
	let request: QueueJobRequest | undefined;

	beforeEach(() => {
		const queueServiceMock = new Mock<LendingStatsProcessQueueService>();
		queueServiceMock
			.setup(svc => {
				void svc.queueProcess(It.IsAny<QueueJobRequest>() as QueueJobRequest);
			})
			.callback(({ args: [incomingRequest] }) => request = incomingRequest as QueueJobRequest);

		appController = new UpdateStatisticsController(queueServiceMock.object());
	});

	describe('root', () => {
		it('should return "Hello World!"', () => {
			void appController.queueJob({
				processType: UpdateProcessType.UpdateAccountsFromTransactions
			});

			expect(request?.processType)
				.toBe(UpdateProcessType.UpdateAccountsFromTransactions);
		});
	});
});
