import type { Job } from 'bullmq';
import { ProcessHandler } from './process-handler';
import { UpdateProcessType } from '../../../models/update-process-type';

export class UpdateLoanLimitsProcessHandler extends ProcessHandler {
	public get id(): number {
		return UpdateProcessType.UpdateLoanLimit;
	}

	public async process(_job: Job): Promise<void> {
		// Implementation for updating account balance
	}
}
