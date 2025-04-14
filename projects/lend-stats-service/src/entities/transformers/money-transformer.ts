// TODO: Check if there's a better way, because of floating point issues.
export class MoneyTransformer {
	public to(data: number): number {
		return data;
	}

	public from(data: string): number {
		return parseFloat(data);
	}
}
