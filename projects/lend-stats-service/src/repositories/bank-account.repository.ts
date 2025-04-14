import { DataSource } from 'typeorm';
import { BankAccountEntity } from '../entities/bank-account.entity';
import { BaseDatabaseRepository } from './base-database.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BankAccountRepository extends BaseDatabaseRepository<BankAccountEntity> {
	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource, BankAccountEntity);
	}
	// #endregion

	// #region Public Methods
	public async getByPerson(personId: string): Promise<BankAccountEntity[]> {
		return await this.repository.find({
			where: {
				personId: personId
			}
		});
	}
	// #endregion
}
