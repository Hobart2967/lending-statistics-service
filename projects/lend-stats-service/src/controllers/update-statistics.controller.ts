import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
	LendingStatsProcessQueueService
} from '../queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { QueueJobRequest } from '../models/queue-job-request';

@Controller('stats')
export class StatisticsController {
	// #region Ctor
	public constructor(private readonly queueService: LendingStatsProcessQueueService) {}
	// #endregion

	// #region Public Methods
	@Post()
	@HttpCode(HttpStatus.CREATED)
	// TODO: Security
	public async queueJob(@Body() queueJobRequest: QueueJobRequest): Promise<void> {
		await this.queueService.queueProcess(queueJobRequest);
	}
	// #endregion
}
