/* istanbul ignore file */

import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import { EntityBase } from './entity-base';
import { PersonEntity } from './person.entity';
import { MoneyTransformer } from './transformers/money-transformer';

@Entity()
export class BankAccountEntity extends EntityBase {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static readonly entityName: string = 'bank_account_entity';
	@ManyToOne(() => PersonEntity)
	public person: PersonEntity;
	@RelationId((bankAccount: BankAccountEntity) => bankAccount.person)
	@Column()
	public personId: string;
	@Column()
	@Index('iban-idx', { unique: true })
	public accountIban: string;
	@Column({ type: 'decimal', precision: 22, scale: 2, transformer: new MoneyTransformer() })
	public balance: number;
	@Column()
	@Index('balance-update-idx')
	public balanceUpdatedAt: Date;
}
