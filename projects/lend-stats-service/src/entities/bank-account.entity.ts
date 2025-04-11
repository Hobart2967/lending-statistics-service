import { Column, Entity, Index, ManyToOne, RelationId } from 'typeorm';
import { EntityBase } from './entity-base';
import { PersonEntity } from './person.entity';

@Entity()
export class BankAccountEntity extends EntityBase {
	@ManyToOne(() => PersonEntity)
	public person: PersonEntity;
	@RelationId((bankAccount: BankAccountEntity) => bankAccount.person)
	public personId: string;
	@Column()
	@Index('iban-idx', { unique: true })
	public accountIban: string;
	@Column()
	public balance: number;
	@Column()
	@Index('balance-update-idx')
	public balanceUpdatedAt: Date;
}
