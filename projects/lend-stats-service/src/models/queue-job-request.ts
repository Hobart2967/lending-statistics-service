/* istanbul ignore */
import { ApiProperty } from '@nestjs/swagger';
import type { UpdateProcessType } from './update-process-type';

export class QueueJobRequest {
	@ApiProperty()
	public processType: UpdateProcessType;
}
