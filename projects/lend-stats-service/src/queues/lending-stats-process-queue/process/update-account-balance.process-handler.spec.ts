import { It, Mock } from 'moq.ts';
import { UpdateAccountBalanceProcessHandler } from './update-account-balance.process-handler';
import type { BankAccountRepository } from '../../../repositories/bank-account.repository';
import type { TransactionRepository } from '../../../repositories/transaction.repository';
import type { Job } from 'bullmq';
import type { BankAccountEntity } from '../../../entities/bank-account.entity';
import type { TransactionEntity } from '../../../entities/transaction.entity';
import type { PersonEntity } from '../../../entities/person.entity';
import { UpdateProcessType } from '../../../models/update-process-type';

describe(UpdateAccountBalanceProcessHandler.name, () => {
	const originalAccount: BankAccountEntity = {
		accountIban: 'DE89370400440532013000',
		balance: 1000,
		balanceUpdatedAt: new Date('2023-10-01T00:00:00Z'),
		id: '1',
		personId: '1',
		createdAt: new Date(),
		updatedAt: new Date(),
		person: null as unknown as PersonEntity
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let findTransactionsForIbanSinceInputs: any[] = [];
	let transactionResults: TransactionEntity[] = [];
	const transactionRepositoryMock = new Mock<TransactionRepository>()
		.setup(async repo => await repo.findTransactionsForIbanSince(
			It.IsAny<string>() as string,
			It.IsAny<Date>() as Date
		))
		.callback(async args => {
			findTransactionsForIbanSinceInputs = args.args;

			return await Promise.resolve(transactionResults);
		});

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let bankAccountUpdateInputs: any[] = [];
	const bankAccountRepositoryMock = new Mock<BankAccountRepository>()
		.setup(async repo => await repo.getAll())
		.returnsAsync([originalAccount] as BankAccountEntity[])

		.setup(async x => await x.update(It.IsAny<BankAccountEntity>() as BankAccountEntity))
		.callback(async args => {
			bankAccountUpdateInputs = args.args;

			return await Promise.resolve(args.args[0] as BankAccountEntity);
		});

	it('should update account balance from transactions', async () => {
		const processHandler = new UpdateAccountBalanceProcessHandler(
			bankAccountRepositoryMock.object(),
			transactionRepositoryMock.object()
		);

		transactionResults = [
			{
				fromIban: 'DE89370400440532013000',
				toIban: 'DE89370400440532013001',
				amount: 99.95,
				createdAt: new Date(),
				id: '1'
			},
			{
				fromIban: 'DE89370400440532013001',
				toIban: 'DE89370400440532013000',
				amount: 50,
				createdAt: new Date(),
				id: '1'
			},
			{
				fromIban: 'DE89370400440532013001',
				toIban: 'DE89370400440532013000',
				amount: 500.03,
				createdAt: new Date(),
				id: '1'
			}
		] as TransactionEntity[];

		const previousBalanceUpdatedAt = originalAccount.balanceUpdatedAt;

		await processHandler.process({} as unknown as Job);

		const [updatedBankAccount] = bankAccountUpdateInputs as [BankAccountEntity];

		expect(updatedBankAccount)
			.toBeDefined();
		expect(updatedBankAccount.balance)
			.toEqual(1000 - 99.95 + 50 + 500.03);
		expect(updatedBankAccount.balanceUpdatedAt.getTime())
			.toBeGreaterThan(previousBalanceUpdatedAt.getTime());

		const [
			iban,
			date
		] = findTransactionsForIbanSinceInputs as [string, Date];

		expect(iban)
			.toEqual('DE89370400440532013000');

		expect(date)
			.toEqual(previousBalanceUpdatedAt);
	});

	it('has the correct job id', () => {
		const processHandler = new UpdateAccountBalanceProcessHandler(
			bankAccountRepositoryMock.object(),
			transactionRepositoryMock.object()
		);

		expect(processHandler.id)
			.toEqual(UpdateProcessType.UpdateAccountsFromTransactions);
	});
});
