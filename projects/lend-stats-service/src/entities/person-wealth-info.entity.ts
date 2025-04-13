import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { PersonEntity } from './person.entity';
import { EntityBase } from './entity-base';
import { MoneyTransformer } from './converters/money-transformer';

@Entity()
export class PersonWealthInfoEntity extends EntityBase {
	@ManyToOne(() => PersonEntity)
	public person: PersonEntity;
	@RelationId((wealthInfo: PersonWealthInfoEntity) => wealthInfo.person)
	@Column()
	public personId: string;
	@Column({ type: 'decimal', precision: 22, scale: 2, transformer: new MoneyTransformer() })
	public totalBalance: number;
}
