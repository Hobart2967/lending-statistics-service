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
import { LendingStatsProcessQueueService } from '../src/queues/lending-stats-process-queue/lending-stats-process-queue.service';
import { QueueJobRequest } from '../src/models/queue-job-request';
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
		persons = Array.from({ length: 10 }, () => {
			const person = new PersonEntity();
			person.name = faker.person.fullName();
			person.email = faker.internet.email();

			return person;
		});

		await Promise.all(persons.map(async person => {
			await personRepository.create(person);
		}));

		const bankAccountRepository = app.get(BankAccountRepository);
		const bankAccountInfos = [
			{
				personId: persons[0].id,
				accountIban: faker.finance.iban(),
				balance: 1032.23,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[0].id,
				accountIban: faker.finance.iban(),
				balance: 1032.23,
				balanceUpdatedAt: new Date('2023-10-01T00:00:00Z')
			},
			{
				personId: persons[0].id,
				accountIban: faker.finance.iban(),
				balance: 1032.23,
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
				fromIban: bankAccounts[0].accountIban,
				toIban: bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 4.99,
				fromIban: bankAccounts[1].accountIban,
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 3.89,
				fromIban: bankAccounts[1].accountIban,
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 50.00,
				fromIban: bankAccounts[2].accountIban,
				toIban: bankAccounts[1].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 500.00,
				fromIban: bankAccounts[0].accountIban,
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			// Transfers from/to external
			{
				amount: 500.00,
				fromIban: 'DE-123456789012345',
				toIban: bankAccounts[2].accountIban,
				transactionDate: new Date('2023-11-01T00:00:00Z')
			},
			{
				amount: 350.00,
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
		const personRepository = app.get(PersonRepository);
		await Promise.all(persons.map(async person => {
			await personRepository.delete(person);
		}));

		const bankAccountRepository = app.get(BankAccountRepository);
		await Promise.all(bankAccounts.map(async bankAccount => {
			await bankAccountRepository.delete(bankAccount);
		}));

		const transactionRepository = app.get(TransactionRepository);
		await Promise.all(transactions.map(async transaction => {
			await transactionRepository.delete(transaction);
		}));
	});

	it('/ (GET)', async () => {
		const result = await request(app.getHttpServer())
			.post('/')
			.send({
				processType: 1
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
