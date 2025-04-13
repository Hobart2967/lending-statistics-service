import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, RelationId } from 'typeorm';

import { PersonEntity } from './person.entity';

@Entity()
export class FriendshipEntity {
	@OneToOne(() => PersonEntity)
	@JoinColumn()
	public personA: PersonEntity;
	@RelationId((loanLimit: FriendshipEntity) => loanLimit.personA)
	@PrimaryColumn()
	public personAId: string;
	@OneToOne(() => PersonEntity)
	@JoinColumn()
	public personB: PersonEntity;
	@RelationId((loanLimit: FriendshipEntity) => loanLimit.personB)
	@PrimaryColumn()
	public personBId: string;
	@Column()
	public createdAt: Date;
	@Column()
	public updatedAt: Date;

	public constructor() {
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
