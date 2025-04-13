import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueJobRequest } from '../../models/queue-job-request';
import { InjectQueue } from '@nestjs/bullmq';
import { LENDING_STATS_PROCESS_QUEUE } from './lending-stats-process.queue-processor';
import { Job, Queue, QueueEvents } from 'bullmq';
import { randomUUID } from 'crypto';
import { UpdateProcessType } from '../../models/update-process-type';

@Injectable()
export class LendingStatsProcessQueueService implements OnModuleInit {
	private readonly log: Logger = new Logger(LendingStatsProcessQueueService.name);

	public constructor(
		@InjectQueue(LENDING_STATS_PROCESS_QUEUE)
		private readonly processQueue: Queue,

		@InjectQueue(`${LENDING_STATS_PROCESS_QUEUE}-dlq`)
		private readonly processDeadLetterQueue: Queue
	) { }

	public onModuleInit(): void {
		this.log.debug('Subscribing to failed events');
		const events = new QueueEvents(LENDING_STATS_PROCESS_QUEUE);

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		events.on('failed', async (failedJob, err) => {
			const job = await this.processQueue.getJob(failedJob.jobId) as Job<QueueJobRequest>;

			if (job.attemptsMade === job.opts.attempts) {
				this.log.error(`Job ${job.id} failed at maximum attempts: ${err}`);
				await this.processDeadLetterQueue.add(job.name, job.data);
			}
		});
	}

	public async queueProcess(queueJobRequest: QueueJobRequest): Promise<void> {
		this.log.log('Queue Job');
		const processIds = Object.values(UpdateProcessType)
			.filter(x => typeof x === 'number');

		const maximumProcessId = processIds
			.reduce((prev, processId) => Math.max(processId, prev), 1);

		for (let requiredPreceedingJob = 1; requiredPreceedingJob <= maximumProcessId; requiredPreceedingJob++) {
			this.log.log('Queue Job for processId', requiredPreceedingJob);
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
}
