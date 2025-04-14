import type { Job } from 'bullmq';
import { Mock, It } from 'moq.ts';
import type { QueueJobRequest } from '../../models/queue-job-request';
import { UpdateProcessType } from '../../models/update-process-type';
import { LendingStatsProcessQueueProcessor } from './lending-stats-process.queue-processor';
import type { ProcessHandlerRegistry } from './process/process-handler.registry';

describe('LendingStatsProcessQueueProcessor', () => {
	describe('process', () => {
		it('sends a job from a FIFO queue to the correct handler for processing', async () => {
			let processHandler: unknown = null;
			let getProcessHandlerByIdArgs: unknown = null;

			const processHandlerRegistryMock = new Mock<ProcessHandlerRegistry>()
				.setup(registry =>
					registry.getProcessHandlerById(It.IsAny<UpdateProcessType>() as UpdateProcessType))
				.callback(({ args }) => {
					getProcessHandlerByIdArgs = args;

					return processHandler as never;
				});

			const queueProcessor = new LendingStatsProcessQueueProcessor(
				processHandlerRegistryMock.object()
			);

			let pipedJob: unknown = null;

			processHandler = {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/explicit-function-return-type
				process: job => pipedJob = job
			};

			const job = {
				id: 'job-id',
				data: {
					processType: UpdateProcessType.UpdateLoanLimit
				}
			} as unknown as Job<QueueJobRequest>;

			await queueProcessor.process(job);

			expect(pipedJob)
				.toBe(job);
			expect(getProcessHandlerByIdArgs)
				.toEqual([UpdateProcessType.UpdateLoanLimit]);
		});

		it('fails when theres no handler for processing the job', async () => {
			let getProcessHandlerByIdArgs: unknown = null;

			const processHandlerRegistryMock = new Mock<ProcessHandlerRegistry>()
				.setup(registry =>
					registry.getProcessHandlerById(It.IsAny<UpdateProcessType>() as UpdateProcessType))
				.callback(({ args }) => {
					getProcessHandlerByIdArgs = args;

					return null as never;
				});

			const queueProcessor = new LendingStatsProcessQueueProcessor(
				processHandlerRegistryMock.object()
			);

			const job = {
				id: 'job-id',
				data: {
					processType: UpdateProcessType.UpdateLoanLimit
				}
			} as unknown as Job<QueueJobRequest>;

			await expect(async () => {
				await queueProcessor.process(job);
			})
				.rejects
				.toThrow('No handler found for process type 3');

			expect(getProcessHandlerByIdArgs)
				.toEqual([UpdateProcessType.UpdateLoanLimit]);
		});
	});
});
