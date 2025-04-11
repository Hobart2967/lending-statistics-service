import { Module } from '@nestjs/common';
import { UpdateStatisticsController } from './controllers/update-statistics.controller';
import {
	LendingStatsProcessQueueService
} from './queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { dataSourceFactory as dataSourceProvider } from './services/data-source.factory';
import { PersonEntity } from './entities/person.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { PersonRepository } from './repositories/person.repository';
import { Environment, EnvironmentInstance } from './services/environment';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { BullModule } from '@nestjs/bullmq';
import {
	LENDING_STATS_PROCESS_QUEUE,
	LendingStatsProcessQueueProcessor
} from './queues/lending-stats-process-queue/lending-stats-process.queue-processor';
import {
	ProcessHandlerRegistry,
	provideProcessHandler
} from './queues/lending-stats-process-queue/process/process-handler.registry';
import {
	UpdateAccountBalanceProcessHandler
} from './queues/lending-stats-process-queue/process/update-account-balance.process-handler';
import {
	UpdateLoanLimitsProcessHandler
} from './queues/lending-stats-process-queue/process/update-loan-limits.process-handler';
import {
	UpdateUserWorthProcessHandler
} from './queues/lending-stats-process-queue/process/update-user-worth.process-handler';

@Module({
	imports: [
		BullModule.forRoot({
			connection: {
				host: 'localhost',
				port: 6379
			}
		}),
		BullModule.registerQueue({
			name: LENDING_STATS_PROCESS_QUEUE
		}),
		BullModule.registerQueue({
			name: `${LENDING_STATS_PROCESS_QUEUE}-dlq`
		})
	],
	controllers: [UpdateStatisticsController],
	providers: [
		LendingStatsProcessQueueService,
		LendingStatsProcessQueueProcessor,

		// #region Repositories
		PersonRepository,
		BankAccountRepository,
		TransactionRepository,
		// #endregion

		ProcessHandlerRegistry,
		...provideProcessHandler(UpdateAccountBalanceProcessHandler),
		...provideProcessHandler(UpdateLoanLimitsProcessHandler),
		...provideProcessHandler(UpdateUserWorthProcessHandler),

		{
			provide: Environment,
			useFactory: async (): Promise<Environment> => {
				const { stage } = process.env;

				const { environment } = await import(`./environment/environment${stage
					? `.${stage}`
					: ''}`);

				return new Environment(environment as EnvironmentInstance);
			}
		},
		dataSourceProvider(
			PersonEntity,
			BankAccountEntity,
			TransactionEntity
		)
	]
})
export class AppModule {}
