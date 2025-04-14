import type { IMock } from 'moq.ts';
import { It, Mock } from 'moq.ts';
import type { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import type { EntityBase } from '../entities/entity-base';
import { PersonWealthInfoRepository } from './person-wealth-info.repository';
import { PersonWealthInfoEntity } from '../entities/person-wealth-info.entity';
import { PersonEntity } from '../entities/person.entity';

describe(PersonWealthInfoRepository.name, () => {
	let repositoryMock: IMock<Repository<EntityBase>> = new Mock<Repository<EntityBase>>();
	let personRepositoryMock: IMock<Repository<PersonEntity>> = new Mock<Repository<PersonEntity>>();

	const dataSourceMock = new Mock<DataSource>();
	dataSourceMock
		.setup(dataSource => dataSource.getRepository(PersonWealthInfoEntity))
		.callback(() => repositoryMock.object() as unknown as Repository<PersonWealthInfoEntity>)

		.setup(dataSource => dataSource.getRepository(PersonEntity))
		.callback(() => personRepositoryMock
			.object() as unknown as Repository<PersonEntity>);

	beforeEach(() => {
		repositoryMock = new Mock<Repository<EntityBase>>();
		personRepositoryMock = new Mock<Repository<PersonEntity>>();
	});

	describe(PersonWealthInfoRepository.prototype.getPersonWealthInfo, () => {
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

			const repository = new PersonWealthInfoRepository(dataSourceMock.object());
			await repository.getPersonWealthInfo('id-of-hans-wurst');

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({
					where: {
						personId: 'id-of-hans-wurst'
					}
				});
		});
	});

	describe(PersonWealthInfoRepository.prototype.deleteByPersonId, () => {
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

			const repository = new PersonWealthInfoRepository(dataSourceMock.object());
			await repository.deleteByPersonId('id-of-hans-wurst');

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({
					personId: 'id-of-hans-wurst'
				});
		});
	});

	describe(PersonWealthInfoRepository.prototype.calculatePersonWealthInfos, () => {
		it('sums up account balances of a person and returns a ready-to-save PersonWealthInfo', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.delete(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const selectQueryBuilderMock = new Mock<SelectQueryBuilder<PersonEntity>>();
			let selectArgs: unknown = null;
			let innnerJoinArgs: unknown = null;
			let groupByArgs: unknown = null;
			selectQueryBuilderMock
				.setup(queryBuilder => queryBuilder.select(It.IsAny() as never))
				.callback(({ args }) => {
					selectArgs = args;

					return selectQueryBuilderMock.object();
				})

				.setup(queryBuilder => queryBuilder.innerJoin(
					It.IsAny() as never,
					It.IsAny() as never,
					It.IsAny() as never
				))
				.callback(({ args }) => {
					innnerJoinArgs = args;

					return selectQueryBuilderMock.object();
				})

				.setup(queryBuilder => queryBuilder.groupBy(It.IsAny() as never))
				.callback(({ args }) => {
					groupByArgs = args;

					return selectQueryBuilderMock.object();
				})

				.setup(async queryBuilder => await queryBuilder.execute() as never)
				.callback(async () => {
					return await Promise.resolve([
						{
							personId: 'id-of-hans-wurst',
							totalBalance: 1268.33
						},
						{
							personId: 'id-of-john-doe',
							totalBalance: 9537.62
						}
					]) as never;
				});

			personRepositoryMock = personRepositoryMock
				.setup(repo => repo.createQueryBuilder(It.IsAny() as never))
				.callback(({ args }) => {
					calledWith = args;

					return selectQueryBuilderMock.object();
				});

			const repository = new PersonWealthInfoRepository(dataSourceMock.object());
			const result = await repository.calculatePersonWealthInfos();

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual('p');

			expect(selectArgs)
				.toEqual([[
					'p.id AS personId',
					'SUM(ba.balance) AS totalBalance'
				]]);

			expect(innnerJoinArgs)
				.toEqual([
					'bank_account_entity',
					'ba',
					'ba.personId = p.id'
				]);
			expect(groupByArgs)
				.toEqual(['p.id']);

			expect(result)
				.toHaveLength(2);

			expect(result[0])
				.toBeInstanceOf(PersonWealthInfoEntity);
			expect(result[0].personId)
				.toEqual('id-of-hans-wurst');
			expect(result[0].totalBalance)
				.toEqual(1268.33);
			expect(result[1])
				.toBeInstanceOf(PersonWealthInfoEntity);
			expect(result[1].personId)
				.toEqual('id-of-john-doe');
			expect(result[1].totalBalance)
				.toEqual(9537.62);
		});
	});
});
