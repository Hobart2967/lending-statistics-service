import type { Job } from 'bullmq';

/**
 * Base Class for all process handlers.
 */
export abstract class ProcessHandler {
	public abstract get id(): number;
	public abstract process(job: Job): Promise<void>;
}
