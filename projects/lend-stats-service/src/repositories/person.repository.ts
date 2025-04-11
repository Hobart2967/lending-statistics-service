import { DataSource, Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonRepository extends DatabaseRepository {
	// #region Private Fields
	private readonly repository: Repository<PersonEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(PersonEntity);
	}
	// #endregion

	// #region Public Methods
	public async getPersonById(personId: string): Promise<PersonEntity | null> {
		return await this.repository
			.findOne({ where: { id: personId } });
	}

	public async create(person: PersonEntity): Promise<void> {
		await this.repository.insert(person);
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}

	public async delete(person: PersonEntity): Promise<void> {
		await this.repository.delete({
			id: person.id
		});
	}
	// #endregion
}
