import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ProcessHandlerRegistry } from './process/process-handler.registry';
import { QueueJobRequest } from '../../models/queue-job-request';

export const LENDING_STATS_PROCESS_QUEUE = 'lending-stats-jobs';

@Processor(LENDING_STATS_PROCESS_QUEUE)
export class LendingStatsProcessQueueProcessor extends WorkerHost {
	private readonly log: Logger = new Logger(LendingStatsProcessQueueProcessor.name);

	public constructor(private readonly processHandlerRegistry: ProcessHandlerRegistry) {
		super();
	}

	public async process(job: Job<QueueJobRequest>, _token?: string): Promise<void> {
		this.log.debug('Processing job', job.id);

		const { data: queueJobRequest } = job;

		const handler = this.processHandlerRegistry.getProcessHandlerById(queueJobRequest.processType);
		if (!handler) {
			this.log.error(`No handler found for process type ${queueJobRequest.processType}`);
			throw new Error(`No handler found for process type ${queueJobRequest.processType}`);
		}

		this.log.debug(`Processing job with handler ${handler.constructor.name}`);
		await handler.process(job);
	}
}
