import { DataSource, Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { DatabaseRepository } from '../services/database-repository.service';
import { Injectable } from '@nestjs/common';
import { FriendshipEntity } from '../entities/friendship.entity';

@Injectable()
export class PersonRepository extends DatabaseRepository {
	// #region Private Fields
	private readonly repository: Repository<PersonEntity>;
	private readonly friendshipRepository: Repository<FriendshipEntity>;
	// #endregion

	// #region Ctor
	public constructor(dataSource: DataSource) {
		super(dataSource);

		this.repository = this.dataSource.getRepository(PersonEntity);
		this.friendshipRepository = this.dataSource.getRepository(FriendshipEntity);
	}
	// #endregion

	// #region Public Methods
	public async getPersonById(personId: string): Promise<PersonEntity | null> {
		return await this.repository
			.findOne({ where: { id: personId } });
	}

	public async create(person: PersonEntity): Promise<void> {
		await this.repository.insert(person);
	}

	public async clear(): Promise<void> {
		await this.repository.clear();
	}

	public async delete(person: PersonEntity): Promise<void> {
		const friends = await this.getFriends(person.id);

		for (const friendship of friends) {
			await this.removeFriendship(person.id, friendship.personBId);
		}

		await this.repository.delete({
			id: person.id
		});
	}

	public async getAll(): Promise<PersonEntity[]> {
		return await this.repository.find();
	}

	public async addFriendship(personAId: string, personBId: string): Promise<void> {
		if (await this.friendshipExists(personAId, personBId)) {
			return;
		}

		await this.dataSource.createEntityManager()
			.transaction(async entityManager => {
				const friendshipRepository = entityManager.getRepository(FriendshipEntity);

				let friendship = new FriendshipEntity();
				friendship.personAId = personAId;
				friendship.personBId = personBId;

				await friendshipRepository.upsert(friendship, [
					'personAId',
					'personBId'
				]);

				friendship = new FriendshipEntity();
				friendship.personAId = personBId;
				friendship.personBId = personAId;

				await friendshipRepository.upsert(friendship, [
					'personAId',
					'personBId'
				]);
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

	public async getPersonsOfFriendsOf(id: string): Promise<PersonEntity[]> {
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
