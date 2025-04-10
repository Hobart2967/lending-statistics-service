import { Module } from '@nestjs/common';
import { UpdateStatisticsController } from './controllers/update-statistics.controller';
import { QueueService } from './services/queue.service';
import { dataSourceFactory as dataSourceProvider } from './services/data-source.factory';
import { PersonEntity } from './entities/person.entity';
import { BankAccountEntity } from './entities/bank-account.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { ProcessService } from './services/process.service';
import { PersonRepository } from './repositories/person.repository';

@Module({
	imports: [],
	controllers: [UpdateStatisticsController],
	providers: [
		QueueService,
		ProcessService,
		PersonRepository,
		dataSourceProvider(
			PersonEntity,
			BankAccountEntity,
			TransactionEntity
		)
	]
})
export class AppModule {}
