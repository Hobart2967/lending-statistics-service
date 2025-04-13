import { MoneyTransformer } from './money-transformer';

describe(MoneyTransformer.name, () => {
	it('should transform number from input value', () => {
		const transformer = new MoneyTransformer();
		const value = '123.45';
		const result = transformer.from(value);
		expect(result)
			.toBe(123.45);
	});

	it('should transform input value to number', () => {
		const transformer = new MoneyTransformer();
		const value = 123.45;
		const result = transformer.to(value);
		expect(result)
			.toBe(123.45);
	});
});
