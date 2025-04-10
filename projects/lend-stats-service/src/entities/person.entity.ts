import { Column, Entity } from 'typeorm';
import { EntityBase } from './entity-base';

@Entity()
export class PersonEntity extends EntityBase {
	@Column()
	public name: string;
	@Column()
	public email: string;
	// TODO: Friends
}
