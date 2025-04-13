import { Module } from '@nestjs/common';
import { StatisticsController } from './controllers/update-statistics.controller';
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
	UpdateUserWealthProcessHandler
} from './queues/lending-stats-process-queue/process/update-user-wealth.process-handler';
import { PersonWealthInfoEntity } from './entities/person-wealth-info.entity';
import { PersonLoanLimitEntity } from './entities/person-loan-limit.entity';
import { PersonLoanLimitRepository } from './repositories/person-loan-limit.repository';
import { PersonWealthInfoRepository } from './repositories/person-wealth-info.repository';
import { FriendshipEntity } from './entities/friendship.entity';
import { PersonController } from './controllers/person.controller';

@Module({
	imports: [
		BullModule.forRoot({
			connection: {
				// TODO: Move this to environment
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
	controllers: [
		StatisticsController,
		PersonController
	],
	providers: [
		LendingStatsProcessQueueService,
		LendingStatsProcessQueueProcessor,

		// #region Repositories
		PersonRepository,
		BankAccountRepository,
		TransactionRepository,
		PersonLoanLimitRepository,
		PersonWealthInfoRepository,
		// #endregion

		ProcessHandlerRegistry,
		...provideProcessHandler(UpdateAccountBalanceProcessHandler),
		...provideProcessHandler(UpdateLoanLimitsProcessHandler),
		...provideProcessHandler(UpdateUserWealthProcessHandler),

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
			TransactionEntity,
			PersonWealthInfoEntity,
			PersonLoanLimitEntity,
			FriendshipEntity
		)
	]
})
export class AppModule {}
