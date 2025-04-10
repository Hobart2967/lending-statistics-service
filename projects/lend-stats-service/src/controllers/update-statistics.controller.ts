import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueueService } from '../services/queue.service';
import { QueueJobRequest } from '../models/queue-job-request';

@Controller()
export class UpdateStatisticsController {
	public constructor(private readonly queueService: QueueService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	// TODO: Security
	public queueJob(@Body() queueJobRequest: QueueJobRequest): void {
		this.queueService.queueProcess(queueJobRequest);
	}
}
