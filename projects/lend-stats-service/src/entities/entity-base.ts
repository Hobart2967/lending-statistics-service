import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class EntityBase {
	@PrimaryGeneratedColumn('uuid')
	public id: string;
	@Column()
	public createdAt: Date;
	@Column()
	public updatedAt: Date;

	public constructor() {
		this.id = crypto.randomUUID();
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
