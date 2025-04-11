import { Provider, Type, Injectable, OnModuleInit } from '@nestjs/common';
import { ProcessHandler } from './process-handler';

export class ProcessHandlerRegistry {
	// #region Private Fields
	private readonly processHandlers: Record<number, ProcessHandler> = {};
	// #endregion

	// #region Public Methods
	public getProcessHandlerById(id: number): ProcessHandler | undefined {
		return this.processHandlers[id];
	}

	public registerProcessHandler(processHandler: ProcessHandler): void {
		if (!processHandler.id) {
			throw new Error('ProcessHandler must have a key property.');
		}
		this.processHandlers[processHandler.id] = processHandler;
	}
	// #endregion
}

/**
 * Provides a process handler to the dependency injection context,
 * while also registering it to the ProcessHandlerRegistry.
 *
 * @param type The type of the process handler to be registered.
 * @returns An array of providers ready to be configured to a nestjs module.
 */
export function provideProcessHandler<TProcessHandler extends ProcessHandler>(type: Type<TProcessHandler>): Provider[] {
	@Injectable()
	class ProcessHandlerFactory implements OnModuleInit {
		public constructor(
			private readonly registry: ProcessHandlerRegistry,
			private readonly handler: TProcessHandler
		) { }

		public onModuleInit(): void {
			this.registry.registerProcessHandler(this.handler);
		}
	}

	return [
		type,
		{
			provide: ProcessHandlerFactory,
			useFactory: (registry: ProcessHandlerRegistry, handler: TProcessHandler) =>
				new ProcessHandlerFactory(registry, handler),
			inject: [
				ProcessHandlerRegistry,
				type
			]
		}
	];
}
