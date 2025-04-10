import { Entity } from 'typeorm';
import { EntityBase } from './entity-base';

@Entity()
export class BankAccountEntity extends EntityBase {
	public personId: number;
	public accountIban: string;
	public balance: number;
}
