import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PersonWealthInfoEntity } from '../entities/person-wealth-info.entity';
import { BaseDatabaseRepository } from './base-database.repository';
import { PersonEntity } from '../entities/person.entity';
import { BankAccountEntity } from '../entities/bank-account.entity';

@Injectable()
export class PersonWealthInfoRepository extends BaseDatabaseRepository<PersonWealthInfoEntity> {
	// #region Private Fields
	private readonly personRepository: Repository<PersonEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource, PersonWealthInfoEntity);

		this.personRepository = this.dataSource.getRepository(PersonEntity);
	}
	// #endregion

	// #region Public Methods
	public async getPersonWealthInfo(personId: string): Promise<PersonWealthInfoEntity | null> {
		return await this.repository
			.findOne({ where: { personId } });
	}

	public async deleteByPersonId(personId: string): Promise<void> {
		await this.repository.delete({
			personId
		});
	}

	public async calculatePersonWealthInfos(): Promise<PersonWealthInfoEntity[]> {
		const results = await this.personRepository
			.createQueryBuilder('p')
			.select([
				'p.id AS personId',
				'SUM(ba.balance) AS totalBalance'
			])
			.innerJoin(BankAccountEntity.entityName, 'ba', 'ba.personId = p.id')
			.groupBy('p.id')
			.execute();

		const wealthInfos: PersonWealthInfoEntity[] = results.map(result => {
			const entity = new PersonWealthInfoEntity();

			entity.personId = result.personId;
			entity.totalBalance = result.totalBalance;

			return entity;
		});

		return wealthInfos;
	}
	// #endregion
}
