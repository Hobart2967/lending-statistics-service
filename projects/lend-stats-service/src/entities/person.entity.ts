/* istanbul ignore file */
import { Column, Entity } from 'typeorm';
import { EntityBase } from './entity-base';
import { FriendshipEntity } from './friendship.entity';

@Entity()
export class PersonEntity extends EntityBase {
	@Column()
	public name: string;
	@Column()
	public email: string;
	public friends: FriendshipEntity[];
}
