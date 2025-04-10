import { Injectable, Logger } from '@nestjs/common';
import { PersonRepository } from '../repositories/person.repository';

@Injectable()
export class ProcessService {
	private readonly logger: Logger = new Logger(ProcessService.name);

	public constructor(private readonly _personRepository: PersonRepository) {

	}

	public async updateAccountsFromTransactions(_since: Date | null): Promise<void> {
		const person = await this._personRepository.getPersonById('4f5a39b0-2888-4b66-9295-3e9e84e5af41');
		this.logger.log(`Person: ${JSON.stringify(person)}`);
	}
}
