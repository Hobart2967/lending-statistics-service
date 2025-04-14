/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PersonRepository } from '../src/repositories/person.repository';
import { PersonEntity } from '../src/entities/person.entity';
import { BankAccountEntity } from '../src/entities/bank-account.entity';
import { BankAccountRepository } from '../src/repositories/bank-account.repository';
import type { InterfaceOf } from './utils/interface-of';
import { TransactionRepository } from '../src/repositories/transaction.repository';
import { TransactionEntity } from '../src/entities/transaction.entity';
import { PersonWealthInfoRepository } from '../src/repositories/person-wealth-info.repository';
import { PersonLoanLimitRepository } from '../src/repositories/person-loan-limit.repository';
import type { INestApplication } from '@nestjs/common';

interface SeedingContext {
	app: INestApplication;
	persons: PersonEntity[];
	bankAccounts: BankAccountEntity[];
	transactions: TransactionEntity[];
}

export function seed(
	context: Partial<SeedingContext>,
	innerBeforeEach: () => Promise<INestApplication> | INestApplication
): void {
	beforeEach(async () => {
		context.app = await innerBeforeEach();

		const personRepository = context.app.get(PersonRepository);
		const names = [
			'Rodrique Arne',
			'Rebecka Beauchop',
			'Torie Jentin'
		];

		const emails = [
			'rarne0@smugmug.com',
			'rbeauchop1@wikia.com',
			'tjentin2@blogger.com'
		];

		const personIds = [
			'bf302ddb-0461-4441-9d41-7f9bfd455329',
			'd0a9081b-c379-4133-a5a8-6f5ec0d6c46d',
			'4ec52122-1894-4740-9eec-95556e0ff4b6'
		];

		// TODO: Simplify seeding
		context.persons = Array.from({ length: 3 }, (_, i) => {
			const person = new PersonEntity();
			person.id = personIds[i];
			person.name = names[i];
			person.email = emails[i];

			return person;
		});

		await Promise.all(context.persons.map(async person => {
			await personRepository.create(person);
		}));

		for (const person of context.persons) {
			for (const friend of context.persons.filter(potentialFriend => potentialFriend.id !== person.id)) {
				await personRepository.addFriendship(person.id, friend.id);
			}
		}

		const bankAccountRepository = context.app.get(BankAccountRepository);
		const bankAccountInfos = [
			{
				id: 'e8b5bcf9-8064-4022-bd2d-ef32b9c6da6f',
				personId: context.persons[0].id,
				accountIban: 'NL40RABO2486932380',
				balance: 1000,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				id: 'db67e3a9-f8f2-4954-b7dd-4079deb108d9',
				personId: context.persons[0].id,
				accountIban: 'NL05INGB7806242643',
				balance: 50,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				id: '01623c77-60db-45a5-aee0-81c5aa147d52',
				personId: context.persons[1].id,
				accountIban: 'KZ363623822945619532',
				balance: 300,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				id: 'f9477072-6305-4de7-8320-eb588be8ac59',
				personId: context.persons[1].id,
				accountIban: 'DE68500105177984816453',
				balance: 600,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				id: 'e51928df-5cee-4d08-8825-b14a21437062',
				personId: context.persons[1].id,
				accountIban: 'CZ4550514288639185511292',
				balance: 400,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				id: 'd7ee3003-5d1d-4498-a6c6-5e549b07e306',
				personId: context.persons[2].id,
				accountIban: 'TD1223166815593933812458332',
				balance: 3000,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			}
		] as Array<InterfaceOf<BankAccountEntity>>;

		context.bankAccounts = bankAccountInfos.map(bankAccountInfo => {
			const bankAccount = new BankAccountEntity();
			bankAccount.id = bankAccountInfo.id;
			bankAccount.personId = bankAccountInfo.personId;
			bankAccount.accountIban = bankAccountInfo.accountIban;
			bankAccount.balance = bankAccountInfo.balance;
			bankAccount.balanceUpdatedAt = bankAccountInfo.balanceUpdatedAt;

			return bankAccount;
		});

		await Promise.all(context.bankAccounts.map(async bankAccount => {
			await bankAccountRepository.create(bankAccount);
		}));

		const transactionRepository = context.app.get(TransactionRepository);
		const transactionInfos = [
			{
				amount: 9.99,
				// person 0
				fromIban: context.bankAccounts[0].accountIban,
				// person 0
				toIban: context.bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 4.99,
				// person 0
				fromIban: context.bankAccounts[1].accountIban,
				// person 1
				toIban: context.bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 3.89,
				// person 0
				fromIban: context.bankAccounts[1].accountIban,
				// person 1
				toIban: context.bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 50.00,
				// person 1
				fromIban: context.bankAccounts[2].accountIban,
				// person 0
				toIban: context.bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 500.00,
				// person 0
				fromIban: context.bankAccounts[0].accountIban,
				// person 1
				toIban: context.bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			// Transfers from/to external
			{
				amount: 500.00,
				fromIban: 'DE-123456789012345',
				// person 1
				toIban: context.bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 350.00,
				// person 1
				fromIban: context.bankAccounts[2].accountIban,
				toIban: 'DE-123456789012345',
				transactionDate: new Date('2023-11-01T00:00:00Z')
			}
		] as Array<Omit<InterfaceOf<TransactionEntity>, 'id' | 'createdAt' | 'updatedAt'>>;

		context.transactions = transactionInfos.map(transactionInfo => {
			const transaction = new TransactionEntity();
			transaction.amount = transactionInfo.amount;
			transaction.fromIban = transactionInfo.fromIban;
			transaction.toIban = transactionInfo.toIban;
			transaction.transactionDate = transactionInfo.transactionDate;

			return transaction;
		});

		await Promise.all(context.transactions.map(async transaction => {
			await transactionRepository.create(transaction);
		}));
	});

	afterEach(async () => {
		// TODO: Simplify

		const bankAccountRepository = context.app!.get(BankAccountRepository);
		await Promise.all(context.bankAccounts!.map(async bankAccount => {
			await bankAccountRepository.delete(bankAccount);
		}));

		const transactionRepository = context.app!.get(TransactionRepository);
		await Promise.all(context.transactions!.map(async transaction => {
			await transactionRepository.delete(transaction);
		}));

		const personRepository = context.app!.get(PersonRepository);

		for (const person of context.persons!) {
			const wealthInfoRepository = context.app!.get(PersonWealthInfoRepository);
			await wealthInfoRepository.deleteByPersonId(person.id);

			const friendships = await personRepository.getFriends(person.id);

			for (const friendship of friendships) {
				const loanLimitRepository = context.app!.get(PersonLoanLimitRepository);
				await loanLimitRepository.deleteByFriendship(person.id, friendship.personBId);
				await loanLimitRepository.deleteByFriendship(friendship.personBId, person.id);

				await personRepository.removeFriendship(person.id, friendship.personBId);
			}

			await wealthInfoRepository.deleteByPersonId(person.id);
			await personRepository.delete(person);
		}
	});
}

