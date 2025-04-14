import { Column, ObjectLiteral, PrimaryGeneratedColumn } from 'typeorm';

export class EntityBase implements ObjectLiteral {
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
