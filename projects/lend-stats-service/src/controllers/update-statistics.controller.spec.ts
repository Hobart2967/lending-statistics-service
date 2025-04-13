/* eslint-disable @typescript-eslint/init-declarations */

import { StatisticsController } from './update-statistics.controller';
import { UpdateProcessType } from '../models/update-process-type';
import { It, Mock } from 'moq.ts';
import type {
	LendingStatsProcessQueueService
} from '../queues/lending-stats-process-queue/lending-stats-process-queue.service';
import type { QueueJobRequest } from '../models/queue-job-request';

describe(StatisticsController.name, () => {
	let appController!: StatisticsController;
	let request: QueueJobRequest | undefined;

	beforeEach(() => {
		const queueServiceMock = new Mock<LendingStatsProcessQueueService>();
		queueServiceMock
			.setup(svc => {
				void svc.queueProcess(It.IsAny<QueueJobRequest>() as QueueJobRequest);
			})
			.callback(({ args: [incomingRequest] }) => request = incomingRequest as QueueJobRequest);

		appController = new StatisticsController(queueServiceMock.object());
	});

	it('should queue the right job type', () => {
		void appController.queueJob({
			processType: UpdateProcessType.UpdateAccountsFromTransactions
		});

		expect(request?.processType)
			.toBe(UpdateProcessType.UpdateAccountsFromTransactions);
	});

	it('should queue the right job type - second check', () => {
		void appController.queueJob({
			processType: UpdateProcessType.UpdatePersonWealth
		});

		expect(request?.processType)
			.toBe(UpdateProcessType.UpdatePersonWealth);
	});
});
