import { Controller, Get, Param, Res } from '@nestjs/common';
import { Person } from '../models/person.model';
import { PersonRepository } from '../repositories/person.repository';
import { PersonLoanLimitRepository } from '../repositories/person-loan-limit.repository';
import { Friendship } from '../models/friendship';
import type { Response } from 'express';
import { BankAccountRepository } from '../repositories/bank-account.repository';
import { PersonWealthInfoRepository } from '../repositories/person-wealth-info.repository';
import { PersonEntity } from '../entities/person.entity';

@Controller('person')
export class PersonController {
	// #region Ctor
	public constructor(
		private readonly personRepository: PersonRepository,
		private readonly personLoanLimitRepository: PersonLoanLimitRepository,
		private readonly bankAccountRepository: BankAccountRepository,
		private readonly personWealthInfoRepository: PersonWealthInfoRepository
	) { }
	// #endregion

	// #region Public Methods
	@Get(':personId')
	// TODO: Security
	public async getPerson(
		@Param('personId') personId: string,
		@Res({ passthrough: true }) res: Response
	): Promise<Person | null> {
		const personEntity = await this.personRepository.get(personId);
		if (!personEntity) {
			res.status(204);

			return null;
		}

		return await this.mapToPerson(personEntity);
	}

	@Get()
	// TODO: Security
	public async getPersons(): Promise<Person[]> {
		const personEntities = await this.personRepository.getAll();

		return await Promise.all(personEntities
			.map(async personEntity => await this.mapToPerson(personEntity)));
	}
	// #endregion

	// #region Private Methods
	private async mapToPerson(personEntity: PersonEntity, withoutSubEntities?: boolean): Promise<Person> {
		const bankAccounts = withoutSubEntities
			? null
			: await this.bankAccountRepository.getByPerson(personEntity.id);
		const wealthInfo = withoutSubEntities
			? null
			: await this.personWealthInfoRepository.getPersonWealthInfo(personEntity.id);

		const friends = withoutSubEntities
			? null
			: await this.resolvePersonsFriendships(personEntity);

		return {
			id: personEntity.id,
			name: personEntity.name,
			email: personEntity.email,
			friends,
			accounts: bankAccounts?.map(account => ({
				id: account.id,
				accountIban: account.accountIban,
				balance: account.balance,
				balanceUpdatedAt: account.balanceUpdatedAt
			})) ?? null,
			wealth: wealthInfo?.totalBalance ?? null
		};
	}

	private async resolvePersonsFriendships(personEntity: PersonEntity): Promise<Friendship[]> {
		const friendships = await this.personRepository.getPersonsOfFriendsOf(personEntity.id);
		const friends = await Promise.all(friendships
			.map(async friend => await this.getFriendDetails(friend, personEntity.id)));

		return friends;
	}

	private async getFriendDetails(friend: PersonEntity, personId: string): Promise<Friendship> {
		return {
			person: await this.mapToPerson(friend, true),
			loanLimit: (await this.personLoanLimitRepository.getByFriendship(
				personId,
				friend.id
			))?.limit ?? 0
		} as Friendship;
	}
	// #endregion
}
