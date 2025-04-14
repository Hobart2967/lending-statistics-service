import { Environment } from './environment';

describe(Environment.name, () => {
	describe('current', () => {
		it('should return the pre-configured environment', () => {
			const env = {} as never;
			const environment = new Environment(env);

			expect(environment.current)
				.toBe(env);
		});
	});
});
