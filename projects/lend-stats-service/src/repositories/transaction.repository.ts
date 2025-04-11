import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository extends DatabaseRepository {
	// #region Private Fields
	private readonly repository: Repository<TransactionEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(TransactionEntity);
	}
	// #endregion

	// #region Public Methods
	public async create(transaction: TransactionEntity): Promise<void> {
		await this.repository.insert(transaction);
	}

	public async delete(transaction: TransactionEntity): Promise<void> {
		await this.repository.delete({
			id: transaction.id
		});
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}

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
