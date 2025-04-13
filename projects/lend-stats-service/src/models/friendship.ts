import type { Person } from './person.model';

export interface Friendship {
	person: Person;
	loanLimit: number;
}
