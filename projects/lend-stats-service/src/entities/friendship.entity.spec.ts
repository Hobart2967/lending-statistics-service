import { FriendshipEntity } from './friendship.entity';

describe(FriendshipEntity.name, () => {
	it('should create an instance with default values', () => {
		const date = Date.now();

		const entity = new FriendshipEntity();
		expect(entity.createdAt)
			.toBeInstanceOf(Date);
		expect(entity.createdAt.getTime())
			.toBeGreaterThanOrEqual(date);

		expect(entity.updatedAt)
			.toBeInstanceOf(Date);
		expect(entity.updatedAt.getTime())
			.toBeGreaterThanOrEqual(date);
	});
});
