import type { environment } from '../environment/environment';
export type EnvironmentInstance = typeof environment;

export class Environment {
	public get current(): EnvironmentInstance {
		return this._environment;
	}

	public constructor(private readonly _environment: EnvironmentInstance) {
	}
}
