import { DataSource, Repository } from 'typeorm';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BankAccountRepository extends DatabaseRepository {
	// #region Private Fields
	private readonly repository: Repository<BankAccountEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(BankAccountEntity);
	}
	// #endregion

	// #region Public Methods
	public async create(bankAccount: BankAccountEntity): Promise<void> {
		await this.repository.insert(bankAccount);
	}

	public async delete(bankAccount: BankAccountEntity): Promise<void> {
		await this.repository.delete({
			id: bankAccount.id
		});
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}
	// #endregion
}
