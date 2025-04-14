/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';
import type { Person } from './person.model';

export class Friendship {
	@ApiProperty()
	public person: Person;
	@ApiProperty()
	public loanLimit: number;
}
