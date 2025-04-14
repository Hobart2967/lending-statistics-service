import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseDatabaseRepository } from './base-database.repository';
import { PersonLoanLimitEntity } from '../entities/person-loan-limit.entity';

@Injectable()
export class PersonLoanLimitRepository extends BaseDatabaseRepository<PersonLoanLimitEntity> {
	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource, PersonLoanLimitEntity);
	}
	// #endregion

	// #region Public Methods
	public async getByFriendship(personId: string, friendId: string): Promise<PersonLoanLimitEntity | null> {
		return await this.repository
			.findOne({
				where: {
					personId,
					friendId
				}
			});
	}

	public async deleteByFriendship(personId: string, friendId: string): Promise<void> {
		await this.repository.delete({
			personId,
			friendId
		});
	}
	// #endregion
}
