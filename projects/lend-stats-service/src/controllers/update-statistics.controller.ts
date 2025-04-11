import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
	LendingStatsProcessQueueService
} from '../queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { QueueJobRequest } from '../models/queue-job-request';

@Controller()
export class UpdateStatisticsController {
	public constructor(private readonly queueService: LendingStatsProcessQueueService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	// TODO: Security
	public async queueJob(@Body() queueJobRequest: QueueJobRequest): Promise<void> {
		await this.queueService.queueProcess(queueJobRequest);
	}
}
