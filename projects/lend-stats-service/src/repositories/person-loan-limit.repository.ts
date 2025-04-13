import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DatabaseRepository } from '../services/database-repository.service';
import { PersonLoanLimitEntity } from '../entities/person-loan-limit.entity';

@Injectable()
export class PersonLoanLimitRepository extends DatabaseRepository {
	private readonly repository: Repository<PersonLoanLimitEntity>;

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(PersonLoanLimitEntity);
	}
	// #endregion

	// #region Public Methods
	public async get(personId: string, friendId: string): Promise<PersonLoanLimitEntity | null> {
		return await this.repository
			.findOne({
				where: {
					personId,
					friendId
				}
			});
	}

	public async create(loanLimit: PersonLoanLimitEntity): Promise<void> {
		await this.repository.insert(loanLimit);
	}

	public async delete(personId: string, friendId: string): Promise<void> {
		await this.repository.delete({
			personId,
			friendId
		});
	}

	public async getAll(): Promise<PersonLoanLimitEntity[]> {
		return await this.repository.find();
	}

	public async update(loanLimit: PersonLoanLimitEntity): Promise<PersonLoanLimitEntity> {
		return await this.repository.save(loanLimit);
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}
	// #endregion
}
