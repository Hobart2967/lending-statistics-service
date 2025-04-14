/* istanbul ignore file */
import { ApiProperty } from '@nestjs/swagger';

export class BankAccount {
	@ApiProperty()
	public accountIban: string;
	@ApiProperty()
	public balance: number;
	@ApiProperty()
	public balanceUpdatedAt: Date;
}
