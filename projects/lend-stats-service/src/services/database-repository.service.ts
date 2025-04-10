import type { DataSource } from 'typeorm';

export abstract class DatabaseRepository {
	public constructor(protected readonly dataSource: DataSource) {}
}
