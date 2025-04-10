import { Injectable, Logger } from '@nestjs/common';
import { QueueJobRequest } from '../models/queue-job-request';

@Injectable()
export class QueueService {
	private readonly logger: Logger = new Logger(QueueService.name);

	public queueProcess(queueJobRequest: QueueJobRequest): void {
		this.logger.log(`Queueing process of type: ${queueJobRequest.processType}`);
	}
}
