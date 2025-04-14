import type { IMock } from 'moq.ts';
import { It, Mock } from 'moq.ts';
import type { DataSource, ObjectLiteral, Repository } from 'typeorm';
import type { EntityBase } from '../entities/entity-base';
import { PersonLoanLimitRepository } from './person-loan-limit.repository';

describe(PersonLoanLimitRepository.name, () => {
	let repositoryMock: IMock<Repository<EntityBase>> = new Mock<Repository<EntityBase>>();

	const dataSourceMock = new Mock<DataSource>();
	dataSourceMock
		.setup(dataSource => dataSource.getRepository(It.IsAny() as never))
		.callback(() => repositoryMock.object() as unknown as Repository<ObjectLiteral>);

	beforeEach(() => {
		repositoryMock = new Mock<Repository<EntityBase>>();
	});

	describe(PersonLoanLimitRepository.prototype.getByFriendship, () => {
		it('runs the correct query against the database', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.findOne(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const repository = new PersonLoanLimitRepository(dataSourceMock.object());
			await repository.getByFriendship('id-of-hans-wurst', 'id-of-john-doe');

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({
					where: {
						personId: 'id-of-hans-wurst',
						friendId: 'id-of-john-doe'
					}
				});
		});
	});

	describe(PersonLoanLimitRepository.prototype.deleteByFriendship, () => {
		it('runs the correct query against the database', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.delete(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const repository = new PersonLoanLimitRepository(dataSourceMock.object());
			await repository.deleteByFriendship('id-of-hans-wurst', 'id-of-john-doe');

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({
					personId: 'id-of-hans-wurst',
					friendId: 'id-of-john-doe'
				});
		});
	});
});
