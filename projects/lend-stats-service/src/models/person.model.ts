import type { BankAccount } from './bank-account.model';
import type { Friendship } from './friendship';

export interface Person {
	id: string;
	name: string;
	email: string;
	friends: Friendship[] | null;
	wealth?: number | null;
	accounts?: BankAccount[] | null;
}
