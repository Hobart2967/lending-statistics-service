import { DataSource, MoreThanOrEqual } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { BaseDatabaseRepository } from './base-database.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository extends BaseDatabaseRepository<TransactionEntity> {
	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource, TransactionEntity);
	}
	// #endregion

	// #region Public Methods
	public async findTransactionsForIbanSince(accountIban: string, date: Date): Promise<TransactionEntity[]> {
		return await this.repository.find({
			where: [
				{
					fromIban: accountIban,
					transactionDate: MoreThanOrEqual(date)
				},
				{
					toIban: accountIban,
					transactionDate: MoreThanOrEqual(date)
				}
			]
		});
	}
	// #endregion
}
