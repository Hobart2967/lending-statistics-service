import { Module } from '@nestjs/common';
import { UpdateStatisticsController } from './controllers/update-statistics.controller';
import { QueueService } from './services/queue.service';
import { dataSourceFactory as dataSourceProvider } from './services/data-source.factory';
import { PersonEntity } from './entities/person.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { ProcessService } from './services/process.service';
import { PersonRepository } from './repositories/person.repository';
import { Environment, EnvironmentInstance } from './services/environment';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
	imports: [],
	controllers: [UpdateStatisticsController],
	providers: [
		QueueService,
		ProcessService,

		// #region Repositories
		PersonRepository,
		BankAccountRepository,
		TransactionRepository,
		// #endregion

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
