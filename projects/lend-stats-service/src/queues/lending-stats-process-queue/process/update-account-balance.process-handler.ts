import type { Job } from 'bullmq';
import { ProcessHandler } from './process-handler';
import { UpdateProcessType } from '../../../models/update-process-type';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionRepository } from '../../../repositories/transaction.repository';
import { BankAccountRepository } from '../../../repositories/bank-account.repository';

/**
 * Process handler for updating account balance from transactions.
 * This process handler is responsible for updating the balance of bank accounts
 * based on the transactions associated with them.
 * It retrieves all bank accounts, fetches the transactions for each account since the last balance update,
 * calculates the new balance, and updates the bank account with the new balance and updates
 * its balanceUpdatedAt timestamp.
 */
@Injectable()
export class UpdateAccountBalanceProcessHandler extends ProcessHandler {
	// #region Private Fields
	private readonly log: Logger = new Logger(UpdateAccountBalanceProcessHandler.name);
	// #endregion

	// #region Public Fields
	public get id(): number {
		return UpdateProcessType.UpdateAccountsFromTransactions;
	}
	// #endregion

	// #region Ctor
	public constructor(
		private readonly bankAccountRepository: BankAccountRepository,
		private readonly transactionRepository: TransactionRepository
	) {
		super();
	}
	// #endregion

	// #region Public Methods
	public async process(_job: Job): Promise<void> {
		this.log.debug('Updating account balance from transactions');

		const bankAccounts = await this.bankAccountRepository.getAll();

		// TODO: run this process within a whole transaction

		// TODO: to be able to rollback in case of an error. (if needed/think about it).
		for (const bankAccount of bankAccounts) {
			this.log.debug(`Processing account ${bankAccount.id}`);

			const transactions = await this.transactionRepository.findTransactionsForIbanSince(
				bankAccount.accountIban,
				bankAccount.balanceUpdatedAt
			);

			this.log.debug(`Found ${transactions.length} new transactions for account ${bankAccount.id}`);
			const totalBalance = transactions
				.map(transaction => transaction.fromIban === bankAccount.accountIban
					? -transaction.amount
					: transaction.amount)
				.reduce((acc, amount) => acc + amount, bankAccount.balance);

			bankAccount.balance = totalBalance;
			bankAccount.balanceUpdatedAt = new Date();

			await this.bankAccountRepository.update(bankAccount);

			this.log.debug(`Updated balance for account ${bankAccount.id}: ${totalBalance}`);
		}
	}
	// #endregion
}
