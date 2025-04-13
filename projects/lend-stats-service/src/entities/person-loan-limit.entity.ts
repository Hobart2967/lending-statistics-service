import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { PersonEntity } from './person.entity';
import { EntityBase } from './entity-base';
import { MoneyTransformer } from './converters/money-transformer';

@Entity()
// TODO: Get index to fly
/*
 *@Unique('friend-idx', [
 *'personId',
 *'friendId'
 *])
 */
export class PersonLoanLimitEntity extends EntityBase {
	@ManyToOne(() => PersonEntity)
	public person: PersonEntity;
	@RelationId((loanLimit: PersonLoanLimitEntity) => loanLimit.person)
	@Column()
	public personId: string;
	@ManyToOne(() => PersonEntity)
	public friend: PersonEntity;
	@RelationId((loanLimit: PersonLoanLimitEntity) => loanLimit.friend)
	@Column()
	public friendId: string;
	@Column({ type: 'decimal', precision: 22, scale: 2, transformer: new MoneyTransformer() })
	public limit: number;
}
