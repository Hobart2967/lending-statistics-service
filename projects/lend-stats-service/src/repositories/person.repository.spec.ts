import type { IMock } from 'moq.ts';
import { It, Mock } from 'moq.ts';
import type { EntityManager, DataSource, Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { FriendshipEntity } from '../entities/friendship.entity';
import { PersonRepository } from './person.repository';

describe('PersonRepository', () => {
	let friendsFindCalledWith: unknown[] | null = null;
	let friendshipDeleteCalls: unknown[][] = [];
	let friendshipUpsertCalls: unknown[][] = [];
	let friends: FriendshipEntity[] = [];

	let personRepositoryMock: IMock<Repository<PersonEntity>> = new Mock<Repository<PersonEntity>>();
	let friendshipRepositoryMock: IMock<Repository<FriendshipEntity>> = new Mock<Repository<FriendshipEntity>>();

	const entityManagerMock = new Mock<EntityManager>()
		.setup(async entityManager => await entityManager.transaction(It.IsAny() as never))
		.callback(async ({ args }) => {
			const callback = args[0] as (entityManager: EntityManager) => Promise<void>;
			await callback(entityManagerMock.object());
		})

		.setup(entityManager => entityManager.getRepository(FriendshipEntity))
		.callback(() => friendshipRepositoryMock.object() as unknown as Repository<FriendshipEntity>);

	const dataSourceMock = new Mock<DataSource>();
	dataSourceMock
		.setup(dataSource => dataSource.createEntityManager())
		.returns(entityManagerMock.object() as unknown as EntityManager)

		.setup(dataSource => dataSource.getRepository(PersonEntity))
		.callback(() => personRepositoryMock.object() as unknown as Repository<PersonEntity>)

		.setup(dataSource => dataSource.getRepository(FriendshipEntity))
		.callback(() => friendshipRepositoryMock
			.object() as unknown as Repository<FriendshipEntity>);

	beforeEach(() => {
		friendshipDeleteCalls = [];
		friendshipUpsertCalls = [];
		friendsFindCalledWith = null;
		friends = [
			{
				personAId: 'id-of-hans-wurst',
				personBId: 'id-of-john-doe'
			},
			{
				personAId: 'id-of-hans-wurst',
				personBId: 'id-of-samantha-doe'
			}
		] as unknown as FriendshipEntity[];
		personRepositoryMock = new Mock<Repository<PersonEntity>>();
		friendshipRepositoryMock = new Mock<Repository<FriendshipEntity>>()
			.setup(async repo => {
				await repo.find(It.IsAny() as never);
			})
			.callback(async ({ args }) => {
				friendsFindCalledWith = args;

				return await Promise.resolve(friends) as never;
			})

			.setup(async repo => {
				await repo.findOne(It.IsAny() as never);
			})
			.callback(async ({ args }) => {
				const [firstArg] = args;
				const { where } = firstArg;
				const {
					personAId,
					personBId
				} = where;

				return await Promise.resolve(friends
					.find(x => x.personAId === personAId && x.personBId === personBId)) as never;
			})

			.setup(async repo => {
				await repo.delete(It.IsAny() as never);
			})
			.callback(async ({ args }) => {
				friendshipDeleteCalls.push(args);

				return await Promise.resolve(friends) as never;
			})

			.setup(async repo => {
				await repo.upsert(It.IsAny() as never, It.IsAny() as never);
			})
			.callback(async ({ args }) => {
				friendshipUpsertCalls.push(args);

				return await Promise.resolve(friends) as never;
			});
	});

	describe('delete', () => {
		it('deletes friendships together with the person', async () => {
			let calledWith: unknown[] | null = null;

			personRepositoryMock = personRepositoryMock
				.setup(async repo => {
					await repo.delete(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new PersonRepository(dataSourceMock.object());
			const mockEntityInstance = {
				id: 'is-of-hans-wurst'
			};
			await databaseRepository.delete(mockEntityInstance as never);

			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({ id: mockEntityInstance.id });

			expect(friendshipDeleteCalls)
				.toHaveLength(4);
			expect(friendshipDeleteCalls[0][0])
				.toEqual({
					personAId: mockEntityInstance.id,
					personBId: friends[0].personBId
				});
			expect(friendshipDeleteCalls[1][0])
				.toEqual({
					personAId: friends[0].personBId,
					personBId: mockEntityInstance.id
				});
			expect(friendshipDeleteCalls[2][0])
				.toEqual({
					personAId: mockEntityInstance.id,
					personBId: friends[1].personBId
				});
			expect(friendshipDeleteCalls[3][0])
				.toEqual({
					personAId: friends[1].personBId,
					personBId: mockEntityInstance.id
				});
			expect(friendshipUpsertCalls)
				.toHaveLength(0);
			expect(friendsFindCalledWith)
				.toBeDefined();
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(friendsFindCalledWith![0])
				.toEqual({
					where: {
						personAId: mockEntityInstance.id
					}
				});
		});
	});

	describe('friendshipExists', () => {
		it('checks if a friendship exists between person a and b', async () => {
			const databaseRepository = new PersonRepository(dataSourceMock.object());

			const hansAndJohn = await databaseRepository.friendshipExists('id-of-hans-wurst', 'id-of-john-doe');
			const hansAndMax = await databaseRepository.friendshipExists('id-of-hans-wurst', 'id-of-max-mustermann');

			expect(hansAndJohn)
				.toBe(true);

			expect(hansAndMax)
				.toBe(false);
		});
	});

	describe('addFriendship', () => {
		it('adds friendship if not existing', async () => {
			const databaseRepository = new PersonRepository(dataSourceMock.object());
			await databaseRepository.addFriendship('id-of-hans-wurst', 'id-of-max-mustermann');

			expect(friendshipUpsertCalls)
				.toHaveLength(2);
			expect((friendshipUpsertCalls[0][0] as Record<string, string>).personAId)
				.toEqual('id-of-hans-wurst');
			expect((friendshipUpsertCalls[0][0] as Record<string, string>).personBId)
				.toEqual('id-of-max-mustermann');
			expect((friendshipUpsertCalls[1][0] as Record<string, string>).personAId)
				.toEqual('id-of-max-mustermann');
			expect((friendshipUpsertCalls[1][0] as Record<string, string>).personBId)
				.toEqual('id-of-hans-wurst');
		});

		it('skips adding friendship if existing', async () => {
			const databaseRepository = new PersonRepository(dataSourceMock.object());
			await databaseRepository.addFriendship('id-of-hans-wurst', 'id-of-john-doe');

			expect(friendshipUpsertCalls)
				.toHaveLength(0);
		});
	});
});
