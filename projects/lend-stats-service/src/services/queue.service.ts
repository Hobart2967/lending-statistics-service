import { Injectable, Logger } from '@nestjs/common';
import { QueueJobRequest } from '../models/queue-job-request';
import { UpdateProcessType } from '../models/update-process-type';
import { ProcessService } from './process.service';

@Injectable()
export class QueueService {
	private readonly logger: Logger = new Logger(QueueService.name);

	public constructor(private readonly processService: ProcessService) {
	}

	public queueProcess(queueJobRequest: QueueJobRequest): void {
		this.logger.log(`Queueing process of type: ${queueJobRequest.processType}`);

		/*
		 * TODO: Refactor this to a process type registrar, mapping the process type enum to
		 * certain function handlers or even classes to execute.
		 * TODO: Goal is to have a class implementation for each process type.
		 */

		/*
		 * TODO: Queue must really handle queues. For now, calling the process directly.
		 * TODO: Queues will ensure the service is monitorable, maintainable and recoverable due to DLQ events.
		 * TODO: Depending on the Process, a DLQ may not be needed, as the process recovers data
		 * for itself (e.g. through a full resync)
		 */
		if (queueJobRequest.processType === UpdateProcessType.UpdateAccountsFromTransactions) {
			void this.processService.updateAccountsFromTransactions(new Date());
		}
	}
}
