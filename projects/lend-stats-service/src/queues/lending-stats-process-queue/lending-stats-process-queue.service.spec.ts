import { It, Mock } from 'moq.ts';
import { LendingStatsProcessQueueService } from './lending-stats-process-queue.service';
import type { Queue, QueueEvents } from 'bullmq';
import { UpdateProcessType } from '../../models/update-process-type';

describe('LendingStatsProcessQueueService', () => {
	const queueStats = {
		waiting: 1,
		active: 2,
		delayed: 3
	};
	let getJobArgs: unknown[] | null = null;
	let queueArgs: unknown[][] = [];
	let dlqArgs: unknown[][] = [];
	let dlqCallBack: (() => void) | null = null;
	const queueEventsMock = new Mock<QueueEvents>();

	const dlqMock = new Mock<Queue>()
		.setup(async q => await q.add(It.IsAny() as never, It.IsAny() as never))
		.callback(({ args }) => {
			dlqArgs.push(args);

			if (dlqCallBack) {
				dlqCallBack();
			}

			return Promise.resolve() as never;
		});

	const queueMock = new Mock<Queue>()
		.setup(async q => await q.getJob(It.IsAny() as never) as never)
		.callback(async ({ args }) => {
			getJobArgs = args;

			return await Promise.resolve({
				id: '123',
				name: 'test',
				attemptsMade: 3,
				opts: {
					attempts: 3
				},
				data: {
					jobId: '123',
					name: 'test'
				}
			} as never);
		})

		.setup(async q => await q.getJobCounts() as never)
		.returnsAsync(queueStats as never)

		.setup(async q => await q.add(It.IsAny() as never, It.IsAny() as never, It.IsAny() as never))
		.callback(({ args }) => {
			queueArgs.push(args);

			return Promise.resolve() as never;
		});

	beforeEach(() => {
		queueArgs = [];
		getJobArgs = [];
		dlqArgs = [];
		dlqCallBack = null;
	});

	describe('onModuleInit', () => {
		it('wires up the connection from the queue to the dead letter queue', async () => {
			let onEventArgs: unknown[] | null = null;
			queueEventsMock
				.setup(q => q.on(It.IsAny(), It.IsAny()))
				.callback(({ args }) => {
					onEventArgs = args;

					return queueEventsMock.object();
				});

			const queueService = new LendingStatsProcessQueueService(
				queueMock.object(),
				dlqMock.object(),
				queueEventsMock.object()
			);

			queueService.onModuleInit();

			const failedJob = {
				jobId: '123',
				name: 'test'
			};
			const err = new Error('Test error');

			const [
				eventName,
				callback
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			] = onEventArgs!;

			const dlqPromise = new Promise<void>(resolve => dlqCallBack = resolve);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
			(callback as Function)(failedJob, err);

			await dlqPromise;

			expect(eventName)
				.toEqual('failed');
			expect(callback)
				.toBeInstanceOf(Function);

			expect(getJobArgs)
				.toEqual(['123']);
			expect(dlqArgs)
				.toHaveLength(1);
			expect(dlqArgs[0][0])
				.toEqual(failedJob.name);
			expect(dlqArgs[0][1])
				.toEqual({
					jobId: '123',
					name: 'test'
				});
		});
	});

	describe('queueProcess', () => {
		it('forwards the input job to the queue', async () => {
			const queueService = new LendingStatsProcessQueueService(
				queueMock.object(),
				dlqMock.object(),
				null as never
			);

			const queueJobRequest = {
				processType: UpdateProcessType.UpdateAccountsFromTransactions
			};

			await queueService.queueProcess(queueJobRequest);

			expect(queueArgs)
				.toHaveLength(1);

			const [firstCallArgs] = queueArgs;
			expect(firstCallArgs[0] as string)
				.toHaveLength(36);

			expect(firstCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdateAccountsFromTransactions
				});

			expect(firstCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});
		});

		it('forwards the input job to the queue, respecting its order for type 2', async () => {
			const queueService = new LendingStatsProcessQueueService(
				queueMock.object(),
				dlqMock.object(),
				null as never
			);

			const queueJobRequest = {
				processType: UpdateProcessType.UpdatePersonWealth
			};

			await queueService.queueProcess(queueJobRequest);

			expect(queueArgs)
				.toHaveLength(2);

			const [
				firstCallArgs,
				secondCallArgs
			] = queueArgs;
			expect(firstCallArgs[0] as string)
				.toHaveLength(36);

			expect(firstCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdateAccountsFromTransactions
				});

			expect(firstCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});

			expect(secondCallArgs[0] as string)
				.toHaveLength(36);

			expect(secondCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdatePersonWealth
				});

			expect(secondCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});
		});

		it('forwards the input job to the queue, respecting its order for type 3', async () => {
			const queueService = new LendingStatsProcessQueueService(
				queueMock.object(),
				dlqMock.object(),
				null as never
			);

			const queueJobRequest = {
				processType: UpdateProcessType.UpdateLoanLimit
			};

			await queueService.queueProcess(queueJobRequest);

			expect(queueArgs)
				.toHaveLength(3);

			const [
				firstCallArgs,
				secondCallArgs,
				thirdCallArgs
			] = queueArgs;
			expect(firstCallArgs[0] as string)
				.toHaveLength(36);

			expect(firstCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdateAccountsFromTransactions
				});

			expect(firstCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});

			expect(secondCallArgs[0] as string)
				.toHaveLength(36);

			expect(secondCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdatePersonWealth
				});

			expect(secondCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});

			expect(thirdCallArgs[0] as string)
				.toHaveLength(36);

			expect(thirdCallArgs[1])
				.toEqual({
					...queueJobRequest,
					processType: UpdateProcessType.UpdateLoanLimit
				});

			expect(thirdCallArgs[2])
				.toEqual({
					removeOnComplete: true
				});
		});
	});

	describe('getQueueStatus', () => {
		it('returns the status of the queue', async () => {
			const queueService = new LendingStatsProcessQueueService(
				queueMock.object(),
				dlqMock.object(),
				null as never
			);

			const status = await queueService.getQueueStatus();

			expect(status)
				.toEqual({
					...queueStats,
					total: 1 + 2 + 3
				});
		});
	});
});
