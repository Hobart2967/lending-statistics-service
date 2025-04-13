import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { PersonWealthInfoEntity } from '../entities/person-wealth-info.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { PersonEntity } from '../entities/person.entity';

@Injectable()
export class PersonWealthInfoRepository extends DatabaseRepository {
	private readonly repository: Repository<PersonWealthInfoEntity>;
	private readonly personRepository: Repository<PersonEntity>;

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(PersonWealthInfoEntity);
		this.personRepository = this.dataSource.getRepository(PersonEntity);
	}
	// #endregion

	// #region Public Methods
	public async getPersonWealthInfo(personId: string): Promise<PersonWealthInfoEntity | null> {
		return await this.repository
			.findOne({ where: { personId } });
	}

	public async create(wealthInfo: PersonWealthInfoEntity): Promise<void> {
		await this.repository.insert(wealthInfo);
	}

	public async delete(wealthInfo: PersonWealthInfoEntity): Promise<void> {
		await this.repository.delete({
			personId: wealthInfo.personId
		});
	}

	public async findAll(options: FindManyOptions<PersonWealthInfoEntity>): Promise<PersonWealthInfoEntity[]> {
		return await this.repository.find(options);
	}

	public async getAll(): Promise<PersonWealthInfoEntity[]> {
		return await this.repository.find();
	}

	public async update(wealthInfo: PersonWealthInfoEntity): Promise<PersonWealthInfoEntity> {
		return await this.repository.save(wealthInfo);
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}

	public async calculatePersonWealthInfos(): Promise<PersonWealthInfoEntity[]> {
		const results = await this.personRepository
			.createQueryBuilder('p')
			.select([
				'p.id AS personId',
				'SUM(ba.balance) AS totalBalance'
			])
			.innerJoin('bank_account_entity', 'ba', 'ba.personId = p.id')
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
