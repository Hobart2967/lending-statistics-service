import { Column } from 'typeorm';
import { EntityBase } from './entity-base';

export class TransactionEntity extends EntityBase {
	@Column()
	public fromIban: number;
	@Column()
	public toIban: string;
	@Column()
	public amount: number;
}
