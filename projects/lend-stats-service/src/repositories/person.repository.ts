import { DataSource, Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { BaseDatabaseRepository } from './base-database.repository';
import { Injectable } from '@nestjs/common';
import { FriendshipEntity } from '../entities/friendship.entity';
import { InterfaceOf } from '../../test/utils/interface-of';

@Injectable()
export class PersonRepository extends BaseDatabaseRepository<PersonEntity> {
	// #region Private Fields
	private readonly friendshipRepository: Repository<FriendshipEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource, PersonEntity);

		this.friendshipRepository = this.dataSource.getRepository(FriendshipEntity);
	}
	// #endregion

	// #region Public Methods
	public async delete(person: PersonEntity): Promise<void> {
		const friends = await this.getFriends(person.id);

		for (const friendship of friends) {
			await this.removeFriendship(person.id, friendship.personBId);
		}

		await super.delete(person);
	}

	public async addFriendship(personAId: string, personBId: string): Promise<void> {
		if (await this.friendshipExists(personAId, personBId)) {
			return;
		}

		await this.dataSource.createEntityManager()
			.transaction(async entityManager => {
				const friendshipRepository = entityManager.getRepository(FriendshipEntity);

				const relations = [
					[
						personAId,
						personBId
					],
					[
						personBId,
						personAId
					]
				];

				for (const relation of relations) {
					const [
						a,
						b
					] = relation;

					const friendship = new FriendshipEntity();
					friendship.personAId = a;
					friendship.personBId = b;

					await friendshipRepository.upsert(friendship, [
						'personAId',
						'personBId'
					]);
				}
			});
	}

	public async friendshipExists(personAId: string, personBId: string): Promise<boolean> {
		const existing = await this.friendshipRepository
			.findOne({
				where: {
					personAId,
					personBId
				}
			});

		return !!existing;
	}

	public async getFriends(id: string): Promise<FriendshipEntity[]> {
		return await this.friendshipRepository.find({
			where: {
				personAId: id
			}
		});
	}

	public async getPersonsOfFriendsOf(id: string): Promise<Array<InterfaceOf<PersonEntity>>> {
		return (await this.friendshipRepository
			.createQueryBuilder('friendship')
			.innerJoin('friendship.personB', 'personB')
			.where('friendship.personAId = :id', { id })
			.select('personB.*')
			.execute()) as PersonEntity[];
	}

	public async removeFriendship(personAId: string, personBId: string): Promise<void> {
		await this.dataSource.createEntityManager()
			.transaction(async entityManager => {
				const friendshipRepository = entityManager.getRepository(FriendshipEntity);
				await friendshipRepository.delete({
					personAId,
					personBId
				});

				await friendshipRepository.delete({
					personAId: personBId,
					personBId: personAId
				});
			});
	}
	// #endregion
}
