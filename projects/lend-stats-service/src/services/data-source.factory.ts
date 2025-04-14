/* istanbul ignore file */

import type { Provider } from '@nestjs/common';
import type { DatabaseType, DataSourceOptions, EntitySchema } from 'typeorm';

import { DataSource } from 'typeorm';
import { Environment } from './environment';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function dataSourceFactory(...entities: Array<Function | string | EntitySchema>): Provider<DataSource> {
	return {
		provide: DataSource,
		useFactory: async (currentEnvironment: Environment): Promise<DataSource> => {
			const { current: environment } = currentEnvironment;

			const dataSource = new DataSource({
				type: environment.database.type as DatabaseType,
				host: environment.database.host,
				port: environment.database.port,
				username: environment.database.username,
				password: environment.database.password,
				database: environment.database.database,

				synchronize: true,
				logging: true,

				entities,

				subscribers: [],
				migrations: []
			} as DataSourceOptions);

			return await dataSource.initialize();
		},
		inject: [Environment]
	};
}
