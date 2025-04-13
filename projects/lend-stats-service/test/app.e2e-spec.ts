/* eslint-disable @typescript-eslint/init-declarations */
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PersonRepository } from '../src/repositories/person.repository';
import { PersonEntity } from '../src/entities/person.entity';
import { faker } from '@faker-js/faker';
import { BankAccountEntity } from '../src/entities/bank-account.entity';
import { BankAccountRepository } from '../src/repositories/bank-account.repository';
import type { InterfaceOf } from './utils/interface-of';
import { TransactionRepository } from '../src/repositories/transaction.repository';
import { TransactionEntity } from '../src/entities/transaction.entity';
import {
	LendingStatsProcessQueueService
} from '../src/queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { UpdateProcessType } from '../src/models/update-process-type';
import { PersonWealthInfoRepository } from '../src/repositories/person-wealth-info.repository';
import { PersonLoanLimitRepository } from '../src/repositories/person-loan-limit.repository';

describe('AppController (e2e)', () => {
	let app: INestApplication<App>;
	let persons = [] as PersonEntity[];
	let bankAccounts = [] as BankAccountEntity[];
	let transactions = [] as TransactionEntity[];

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test
			.createTestingModule({
				imports: [AppModule]
			})
			.compile();

		app = moduleFixture.createNestApplication();

		await app.init();

		const personRepository = app.get(PersonRepository);

		// TODO: Simplify seeding
		persons = Array.from({ length: 3 }, () => {
			const person = new PersonEntity();
			person.name = faker.person.fullName();
			person.email = faker.internet.email();

			return person;
		});

		await Promise.all(persons.map(async person => {
			await personRepository.create(person);
		}));

		for (const person of persons) {
			for (const friend of persons.filter(potentialFriend => potentialFriend.id !== person.id)) {
				await personRepository.addFriendship(person.id, friend.id);
			}
		}

		const bankAccountRepository = app.get(BankAccountRepository);
		const bankAccountInfos = [
			{
				personId: persons[0].id,
				accountIban: faker.finance.iban(),
				balance: 1000,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[0].id,
				accountIban: faker.finance.iban(),
				balance: 50,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[1].id,
				accountIban: faker.finance.iban(),
				balance: 300,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[1].id,
				accountIban: faker.finance.iban(),
				balance: 600,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[1].id,
				accountIban: faker.finance.iban(),
				balance: 400,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[2].id,
				accountIban: faker.finance.iban(),
				balance: 3000,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			}
		] as Array<InterfaceOf<BankAccountEntity>>;

		bankAccounts = bankAccountInfos.map(bankAccountInfo => {
			const bankAccount = new BankAccountEntity();
			bankAccount.personId = bankAccountInfo.personId;
			bankAccount.accountIban = bankAccountInfo.accountIban;
			bankAccount.balance = bankAccountInfo.balance;
			bankAccount.balanceUpdatedAt = bankAccountInfo.balanceUpdatedAt;

			return bankAccount;
		});

		await Promise.all(bankAccounts.map(async bankAccount => {
			await bankAccountRepository.create(bankAccount);
		}));

		const transactionRepository = app.get(TransactionRepository);
		const transactionInfos = [
			{
				amount: 9.99,
				// person 0
				fromIban: bankAccounts[0].accountIban,
				// person 0
				toIban: bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 4.99,
				// person 0
				fromIban: bankAccounts[1].accountIban,
				// person 1
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 3.89,
				// person 0
				fromIban: bankAccounts[1].accountIban,
				// person 1
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 50.00,
				// person 1
				fromIban: bankAccounts[2].accountIban,
				// person 0
				toIban: bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 500.00,
				// person 0
				fromIban: bankAccounts[0].accountIban,
				// person 1
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			// Transfers from/to external
			{
				amount: 500.00,
				fromIban: 'DE-123456789012345',
				// person 1
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 350.00,
				// person 1
				fromIban: bankAccounts[2].accountIban,
				toIban: 'DE-123456789012345',
				transactionDate: new Date('2023-11-01T00:00:00Z')
			}
		] as Array<Omit<InterfaceOf<TransactionEntity>, 'id' | 'createdAt' | 'updatedAt'>>;

		transactions = transactionInfos.map(transactionInfo => {
			const transaction = new TransactionEntity();
			transaction.amount = transactionInfo.amount;
			transaction.fromIban = transactionInfo.fromIban;
			transaction.toIban = transactionInfo.toIban;
			transaction.transactionDate = transactionInfo.transactionDate;

			return transaction;
		});

		await Promise.all(transactions.map(async transaction => {
			await transactionRepository.create(transaction);
		}));
	});

	afterEach(async () => {
		// TODO: Simplify

		const bankAccountRepository = app.get(BankAccountRepository);
		await Promise.all(bankAccounts.map(async bankAccount => {
			await bankAccountRepository.delete(bankAccount);
		}));

		const transactionRepository = app.get(TransactionRepository);
		await Promise.all(transactions.map(async transaction => {
			await transactionRepository.delete(transaction);
		}));

		const personRepository = app.get(PersonRepository);

		for (const person of persons) {
			const wealthInfoRepository = app.get(PersonWealthInfoRepository);
			await wealthInfoRepository.delete(person.id);

			const friendships = await personRepository.getFriends(person.id);

			for (const friendship of friendships) {
				const loanLimitRepository = app.get(PersonLoanLimitRepository);
				await loanLimitRepository.delete(person.id, friendship.personBId);
				await loanLimitRepository.delete(friendship.personBId, person.id);

				await personRepository.removeFriendship(person.id, friendship.personBId);
			}

			await wealthInfoRepository.delete(person.id);
			await personRepository.delete(person);
		}
	});

	it('/ (GET)', async () => {
		const result = await request(app.getHttpServer())
			.post('/stats')
			.send({
				processType: UpdateProcessType.UpdateLoanLimit
			})
			.expect(201);

		const queue = app.get(LendingStatsProcessQueueService);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		while (true) {
			const status = await queue.getQueueStatus();
			if (status.total) {
				await new Promise(resolve => setTimeout(resolve, 100));
				continue;
			}

			break;
		}

		return result;
	});
});
