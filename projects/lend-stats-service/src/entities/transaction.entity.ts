import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from './entity-base';

@Entity()
export class TransactionEntity extends EntityBase {
	@Column()
	@Index('from-iban-idx')
	public fromIban: string;
	@Column()
	@Index('to-iban-idx')
	public toIban: string;
	@Column()
	public amount: number;
	@Column()
	@Index('transaction-date-idx')
	public transactionDate: Date;
}
