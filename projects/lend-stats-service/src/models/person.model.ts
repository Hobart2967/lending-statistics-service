/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import type { BankAccount } from './bank-account.model';
import type { Friendship } from './friendship';

export class Person {
	@ApiProperty()
	public id: string;
	@ApiProperty()
	public name: string;
	@ApiProperty()
	public email: string;
	@ApiProperty()
	public friends: Friendship[] | null;
	@ApiProperty()
	public wealth?: number | null;
	@ApiProperty()
	public accounts?: BankAccount[] | null;
}
