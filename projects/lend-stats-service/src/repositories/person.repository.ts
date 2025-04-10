import { DataSource } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PersonRepository extends DatabaseRepository {
	public constructor(dataSource: DataSource) {
		super(dataSource);
	}

	public async getPersonById(personId: string): Promise<PersonEntity | null> {
		return await this.dataSource
			.getRepository(PersonEntity)
			.findOne({ where: { id: personId } });
	}
}
