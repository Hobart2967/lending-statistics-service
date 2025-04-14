import type { IMock } from 'moq.ts';
import { It, Mock } from 'moq.ts';
import { MoreThanOrEqual, type DataSource, type ObjectLiteral, type Repository } from 'typeorm';
import type { EntityBase } from '../entities/entity-base';
import { TransactionRepository } from './transaction.repository';

describe(TransactionRepository.name, () => {
	let repositoryMock: IMock<Repository<EntityBase>> = new Mock<Repository<EntityBase>>();

	const dataSourceMock = new Mock<DataSource>();
	dataSourceMock
		.setup(dataSource => dataSource.getRepository(It.IsAny() as never))
		.callback(() => repositoryMock.object() as unknown as Repository<ObjectLiteral>);

	beforeEach(() => {
		repositoryMock = new Mock<Repository<EntityBase>>();
	});

	describe(TransactionRepository.prototype.findTransactionsForIbanSince, () => {
		it('runs the correct query against the database', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.find(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const repository = new TransactionRepository(dataSourceMock.object());
			const date = new Date();
			await repository.findTransactionsForIbanSince('IBAN', date);

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({
					where: [
						{
							fromIban: 'IBAN',
							transactionDate: MoreThanOrEqual(date)
						},
						{
							toIban: 'IBAN',
							transactionDate: MoreThanOrEqual(date)
						}
					]
				});
		});
	});
});
