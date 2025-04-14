/* eslint-disable @typescript-eslint/init-declarations */
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { seed } from './seed.e2e-util';

describe('Persons Controller (e2e)', () => {
	const context = {};
	let app: INestApplication<App>;

	seed(context, async () => {
		const moduleFixture: TestingModule = await Test
			.createTestingModule({
				imports: [AppModule]
			})
			.compile();

		app = moduleFixture.createNestApplication();

		await app.init();

		return app;
	});

	it('/ (GET)', async () => {
		const result = await request(app.getHttpServer())
			.get('/person')
			.expect(200);

		expect(result.body)
			.toEqual([
				{ id: 'd0a9081b-c379-4133-a5a8-6f5ec0d6c46d',
					name: 'Rebecka Beauchop',
					email: 'rbeauchop1@wikia.com',
					friends: [
						{
							person: {
								id: 'bf302ddb-0461-4441-9d41-7f9bfd455329',
								name: 'Rodrique Arne',
								email: 'rarne0@smugmug.com',
								friends: null,
								accounts: null,
								wealth: null
							},
							loanLimit: 0
						},
						{
							person: {
								id: '4ec52122-1894-4740-9eec-95556e0ff4b6',
								name: 'Torie Jentin',
								email: 'tjentin2@blogger.com',
								friends: null,
								accounts: null,
								wealth: null
							},
							loanLimit: 0
						}
					],
					accounts: [
						{
							id: '01623c77-60db-45a5-aee0-81c5aa147d52',
							accountIban: 'KZ363623822945619532',
							balance: 300,
							balanceUpdatedAt: '2023-10-01T00:00:00.000Z'
						},
						{
							id: 'e51928df-5cee-4d08-8825-b14a21437062',
							accountIban: 'CZ4550514288639185511292',
							balance: 400,
							balanceUpdatedAt: '2023-10-01T00:00:00.000Z'
						},
						{
							id: 'f9477072-6305-4de7-8320-eb588be8ac59',
							accountIban: 'DE68500105177984816453',
							balance: 600,
							balanceUpdatedAt: '2023-10-01T00:00:00.000Z'
						}
					],
					wealth: null },
				{ id: 'bf302ddb-0461-4441-9d41-7f9bfd455329',
					name: 'Rodrique Arne',
					email: 'rarne0@smugmug.com',
					friends: [
						{ person: {
							id: 'd0a9081b-c379-4133-a5a8-6f5ec0d6c46d',
							name: 'Rebecka Beauchop',
							email: 'rbeauchop1@wikia.com',
							friends: null,
							accounts: null,
							wealth: null
						},
						loanLimit: 0 },
						{ person: {
							id: '4ec52122-1894-4740-9eec-95556e0ff4b6',
							name: 'Torie Jentin',
							email: 'tjentin2@blogger.com',
							friends: null,
							accounts: null,
							wealth: null
						},
						loanLimit: 0 }
					],
					accounts: [
						{ id: 'db67e3a9-f8f2-4954-b7dd-4079deb108d9',
							accountIban: 'NL05INGB7806242643',
							balance: 50,
							balanceUpdatedAt: '2023-10-01T00:00:00.000Z' },
						{ id: 'e8b5bcf9-8064-4022-bd2d-ef32b9c6da6f',
							accountIban: 'NL40RABO2486932380',
							balance: 1000,
							balanceUpdatedAt: '2023-10-01T00:00:00.000Z' }
					],
					wealth: null },
				{ id: '4ec52122-1894-4740-9eec-95556e0ff4b6',
					name: 'Torie Jentin',
					email: 'tjentin2@blogger.com',
					friends: [
						{ person: { id: 'd0a9081b-c379-4133-a5a8-6f5ec0d6c46d',
							name: 'Rebecka Beauchop',
							email: 'rbeauchop1@wikia.com',
							friends: null,
							accounts: null,
							wealth: null },
						loanLimit: 0 },
						{ person: { id: 'bf302ddb-0461-4441-9d41-7f9bfd455329',
							name: 'Rodrique Arne',
							email: 'rarne0@smugmug.com',
							friends: null,
							accounts: null,
							wealth: null },
						loanLimit: 0 }
					],
					accounts: [{
						id: 'd7ee3003-5d1d-4498-a6c6-5e549b07e306',
						accountIban: 'TD1223166815593933812458332',
						balance: 3000,
						balanceUpdatedAt: '2023-10-01T00:00:00.000Z'
					}],
					wealth: null }
			]);
	});
});
