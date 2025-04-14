import type { Type } from '@nestjs/common';
import type { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import type { EntityBase } from '../entities/entity-base';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseDatabaseRepository<TEntity extends EntityBase> {
	protected readonly repository: Repository<TEntity>;

	public constructor(
		protected readonly dataSource: DataSource,
		protected readonly entityType: Type<TEntity>
	) {
		this.repository = this.dataSource.getRepository(entityType);
	}

	public async getAll(): Promise<TEntity[]> {
		return await this.repository.find();
	}

	public async get(id: string): Promise<TEntity | null> {
		return await this.repository.findOne({
			id
		} as FindOneOptions<TEntity>);
	}

	public async findAll(options: FindManyOptions<TEntity>): Promise<TEntity[]> {
		return await this.repository.find(options);
	}

	public async create(entity: TEntity): Promise<void> {
		await this.repository.insert(entity as QueryDeepPartialEntity<TEntity>);
	}

	public async delete(entity: TEntity): Promise<void> {
		await this.repository.delete({
			id: entity.id
		} as FindOptionsWhere<TEntity>);
	}

	public async update(bankAccount: TEntity): Promise<TEntity> {
		return await this.repository.save(bankAccount);
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}
}
