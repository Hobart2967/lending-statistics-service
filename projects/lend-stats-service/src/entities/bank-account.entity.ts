import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import { EntityBase } from './entity-base';
import { PersonEntity } from './person.entity';
import { MoneyTransformer } from './converters/money-transformer';

@Entity()
export class BankAccountEntity extends EntityBase {
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
