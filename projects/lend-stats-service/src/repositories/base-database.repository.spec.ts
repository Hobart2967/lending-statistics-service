import type { IMock } from 'moq.ts';
import { It, Mock } from 'moq.ts';
import { BaseDatabaseRepository } from './base-database.repository';
import type { DataSource, ObjectLiteral, Repository } from 'typeorm';
import type { EntityBase } from '../entities/entity-base';

const mockEntity = {};

class TestRepository extends BaseDatabaseRepository<never> {
	public constructor(dataSource: DataSource, entity: never) {
		super(dataSource, entity);
	}
}

describe(BaseDatabaseRepository.name, () => {
	let entityUsed: unknown = null;

	let repositoryMock: IMock<Repository<EntityBase>> = new Mock<Repository<EntityBase>>();

	const dataSourceMock = new Mock<DataSource>();
	dataSourceMock
		.setup(dataSource => dataSource.getRepository(It.IsAny() as never))

		.callback(({ args }) => {
			entityUsed = args[0] as never;

			return repositoryMock.object() as unknown as Repository<ObjectLiteral>;
		});

	beforeEach(() => {
		entityUsed = null;
		repositoryMock = new Mock<Repository<EntityBase>>();
	});

	describe(BaseDatabaseRepository.prototype.clear, () => {
		it('should call clear on the TypeORM repository', async () => {
			let called = false;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.clear();
				})
				.callback(async () => {
					called = true;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			await databaseRepository.clear();

			expect(entityUsed)
				.toBe(mockEntity);

			expect(called)
				.toBe(true);
		});
	});

	describe(BaseDatabaseRepository.prototype.create, () => {
		it('should call create on the TypeORM repository with the given entity', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => await repo.insert(It.IsAny() as never))
				.callback(({ args }) => {
					calledWith = args;

					return null as never;
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			const mockEntityInstance = {} as never;
			await databaseRepository.create(mockEntityInstance);

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toBe(mockEntityInstance);
		});
	});

	describe(BaseDatabaseRepository.prototype.delete, () => {
		it('should call delete on the TypeORM repository with the given entity', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.delete(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			const mockEntityInstance = {
				id: '1'
			};
			await databaseRepository.delete(mockEntityInstance as never);

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({ id: mockEntityInstance.id });
		});
	});

	describe(BaseDatabaseRepository.prototype.get, () => {
		it('should call findOne on the TypeORM repository with the given entity id as only filter', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.findOne(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			const id = '1';
			await databaseRepository.get(id);

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toEqual({ id: id });
		});
	});

	describe(BaseDatabaseRepository.prototype.getAll, () => {
		it('should call find on the TypeORM repository without any arguments to get all', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.find();
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			await databaseRepository.getAll();

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			expect(calledWith)
				.toEqual([]);
		});
	});

	describe(BaseDatabaseRepository.prototype.update, () => {
		it('should call save on the TypeORM repository with the given entity', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.save(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			const mockEntityInstance = {} as never;
			await databaseRepository.update(mockEntityInstance);

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toBe(mockEntityInstance);
		});
	});

	describe(BaseDatabaseRepository.prototype.findAll, () => {
		it('should call find on the TypeORM repository with the search criteria', async () => {
			let calledWith: unknown[] | null = null;
			repositoryMock = repositoryMock
				.setup(async repo => {
					await repo.find(It.IsAny() as never);
				})
				.callback(async ({ args }) => {
					calledWith = args;
					await Promise.resolve();
				});

			const databaseRepository = new TestRepository(dataSourceMock.object(), mockEntity as never);
			const mockEntityInstance = {} as never;
			await databaseRepository.findAll(mockEntityInstance);

			expect(entityUsed)
				.toBe(mockEntity);
			expect(calledWith)
				.toBeDefined();

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			expect(calledWith![0])
				.toBe(mockEntityInstance);
		});
	});
});
