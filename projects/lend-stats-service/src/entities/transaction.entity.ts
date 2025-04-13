import { Column, Entity, Index } from 'typeorm';
import { EntityBase } from './entity-base';
import { MoneyTransformer } from './converters/money-transformer';

@Entity()
export class TransactionEntity extends EntityBase {
	@Column()
	@Index('from-iban-idx')
	public fromIban: string;
	@Column()
	@Index('to-iban-idx')
	public toIban: string;
	@Column({ type: 'decimal', precision: 22, scale: 2, transformer: new MoneyTransformer() })
	public amount: number;
	@Column()
	@Index('transaction-date-idx')
	public transactionDate: Date;
}
