import type { Job } from 'bullmq';
import { ProcessHandler } from './process-handler';
import { ProcessHandlerRegistry, provideProcessHandler } from './process-handler.registry';
import type { FactoryProvider, OnModuleInit, Provider } from '@nestjs/common';

class MockHandler extends ProcessHandler {
	public get id(): number {
		return 123;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public async process(_job: Job): Promise<void> { }
}

describe(ProcessHandlerRegistry.name, () => {
	it('should register and retrieve process handlers', () => {
		const registry = new ProcessHandlerRegistry();

		registry.registerProcessHandler(new MockHandler());

		expect(registry.getProcessHandlerById(123))
			.toBeInstanceOf(MockHandler);
		expect(registry.getProcessHandlerById(2))
			.toBeUndefined();
	});

	it('should throw an error if process handler does not have an id', () => {
		const registry = new ProcessHandlerRegistry();

		expect(() => {
			registry.registerProcessHandler({} as unknown as ProcessHandler);
		})
			.toThrow('ProcessHandler must have a key property.');
	});
});

describe(provideProcessHandler.name, () => {
	it('should provide a process handler and register it', () => {
		const registry = new ProcessHandlerRegistry();

		const result: Provider[] = provideProcessHandler(MockHandler);
		expect(result)
			.toHaveLength(2);
		expect(result[0])
			.toBe(MockHandler);

		const factory = result[1] as unknown as FactoryProvider;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		expect((factory.provide as Function).name)
			.toBe('ProcessHandlerFactory');

		const handler = new MockHandler();
		const moduleInitializer: OnModuleInit = factory.useFactory(registry, handler);
		moduleInitializer.onModuleInit();

		expect(registry.getProcessHandlerById(123))
			.toBeInstanceOf(MockHandler);
		expect(registry.getProcessHandlerById(123))
			.toBe(handler);
	});
});
