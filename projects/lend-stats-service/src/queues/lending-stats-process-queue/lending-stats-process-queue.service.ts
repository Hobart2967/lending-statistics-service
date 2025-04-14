import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueJobRequest } from '../../models/queue-job-request';
import { InjectQueue } from '@nestjs/bullmq';
import { LENDING_STATS_PROCESS_QUEUE } from './lending-stats-process.queue-processor';
import { Job, Queue, QueueEvents } from 'bullmq';
import { randomUUID } from 'crypto';
import { UpdateProcessType } from '../../models/update-process-type';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const LendingStatsQueueEvents = 'LendingStatsQueueEvents';

@Injectable()
export class LendingStatsProcessQueueService implements OnModuleInit {
	// #region Private Fields
	private readonly log: Logger = new Logger(LendingStatsProcessQueueService.name);
	// #endregion

	// #region Ctor
	public constructor(
		@InjectQueue(LENDING_STATS_PROCESS_QUEUE)
		private readonly processQueue: Queue,

		@InjectQueue(`${LENDING_STATS_PROCESS_QUEUE}-dlq`)
		private readonly processDeadLetterQueue: Queue,

		@Inject(LendingStatsQueueEvents)
		private readonly processQueueEvents: QueueEvents
	) { }
	// #endregion

	// #region Public Methods
	public onModuleInit(): void {
		this.log.debug('Subscribing to failed events');

		this.processQueueEvents.on('failed', (failedJob, err) => void this.moveToDeadletterQueue(failedJob, err));
	}

	public async queueProcess(queueJobRequest: QueueJobRequest): Promise<void> {
		this.log.log('Queue Job', queueJobRequest);
		const processIds = Object.values(UpdateProcessType)
			.filter(x => typeof x === 'number');

		const maximumProcessId = processIds
			.reduce((prev, processId) => Math.max(processId, prev), 1);

		const targetJob = Math.min(queueJobRequest.processType, maximumProcessId);

		for (let requiredPreceedingJob = 1; requiredPreceedingJob <= targetJob; requiredPreceedingJob++) {
			this.log.log('Queue Job for processId', requiredPreceedingJob, queueJobRequest);
			await this.processQueue.add(randomUUID(), {
				...queueJobRequest,
				processType: requiredPreceedingJob as UpdateProcessType
			} as QueueJobRequest, {
				removeOnComplete: true
			});
		}
	}

	public async getQueueStatus(): Promise<{
		waiting: number;
		active: number;
		delayed: number;
		total: number;
	}> {
		const jobCounts = await this.processQueue.getJobCounts();

		return {
			waiting: jobCounts.waiting,
			active: jobCounts.active,
			delayed: jobCounts.delayed,
			total: jobCounts.waiting + jobCounts.active + jobCounts.delayed
		};
	}
	// #endregion

	// #region Private Methods
	private async moveToDeadletterQueue(
		failedJob: {
			jobId: string;
			failedReason:
			string;
			prev?: string;
		},
		err: string
	): Promise<void> {
		const job = await this.processQueue.getJob(failedJob.jobId) as Job<QueueJobRequest>;

		if (job.attemptsMade === job.opts.attempts) {
			this.log.error(`Job ${failedJob.jobId} failed: ${err}`);
			this.log.debug(`Moving job ${failedJob.jobId} to dead letter queue`);
			await this.processDeadLetterQueue.add(job.name, job.data);
		}
	}
	// #endregion
}
