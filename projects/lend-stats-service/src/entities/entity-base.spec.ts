import { EntityBase } from './entity-base';

describe(EntityBase.name, () => {
	it('should create an instance with default values', () => {
		const date = Date.now();

		const entity = new EntityBase();
		expect(entity.id)
			.toBeDefined();
		expect(entity.createdAt)
			.toBeInstanceOf(Date);
		expect(entity.createdAt.getTime())
			.toBeGreaterThanOrEqual(date);

		expect(entity.updatedAt)
			.toBeInstanceOf(Date);
		expect(entity.updatedAt.getTime())
			.toBeGreaterThanOrEqual(date);

		const entity2 = new EntityBase();
		expect(entity.id).not.toEqual(entity2.id);
	});
});
