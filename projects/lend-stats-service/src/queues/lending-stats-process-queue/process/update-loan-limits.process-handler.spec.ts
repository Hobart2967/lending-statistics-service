/* eslint-disable @typescript-eslint/no-explicit-any */
import { It, Mock } from 'moq.ts';
import type { PersonEntity } from '../../../entities/person.entity';
import { UpdateProcessType } from '../../../models/update-process-type';
import type { PersonLoanLimitRepository } from '../../../repositories/person-loan-limit.repository';
import type {
	PersonWealthInfoRepository
} from '../../../repositories/person-wealth-info.repository';
import type { PersonRepository } from '../../../repositories/person.repository';
import { UpdateLoanLimitsProcessHandler } from './update-loan-limits.process-handler';
import { In, type FindManyOptions } from 'typeorm';
import type { PersonWealthInfoEntity } from '../../../entities/person-wealth-info.entity';
import { PersonLoanLimitEntity } from '../../../entities/person-loan-limit.entity';
import type { Job } from 'bullmq';
import type { FriendshipEntity } from '../../../entities/friendship.entity';

describe(UpdateLoanLimitsProcessHandler.name, () => {
	let existingLoanLimit: PersonLoanLimitEntity | null = null;
	let wealthInfos: Array<{
		personId: string;
		totalBalance: number;
	}> = [];

	const friendships = [{
		personAId: '1',
		personBId: '2'
	}];

	const personRepositoryMock = new Mock<PersonRepository>()
		.setup(async repo => await repo.getAll())
		.returnsAsync([{
			id: '1',
			name: 'John Doe',
			createdAt: new Date(),
			updatedAt: new Date(),
			friends: [],
			email: 'user1@example.com'
		}] as PersonEntity[])

		.setup(async x => await x.getFriends(It.IsAny<string>() as string))
		.returnsAsync(friendships as unknown as FriendshipEntity[]);

	let getPersonWealthInfoInputs: any[] = [];
	let findAllInputs: any[] = [];
	const personWealthInfoRepositoryMock = new Mock<PersonWealthInfoRepository>()
		.setup(async repo => await repo.getPersonWealthInfo(
			It.IsAny<string>() as string
		))
		.callback(async args => {
			getPersonWealthInfoInputs = args.args;

			return await Promise.resolve(wealthInfos[0] as unknown as PersonWealthInfoEntity);
		})

		.setup(async x => await x.findAll(
			It.IsAny<FindManyOptions<PersonWealthInfoEntity>>() as FindManyOptions<PersonWealthInfoEntity>
		))
		.callback(async args => {
			findAllInputs = args.args;

			return await Promise.resolve(wealthInfos.slice(1) as unknown as PersonWealthInfoEntity[]);
		});

	let getInputs: any[] | null = null;
	let createInputs: any[] | null = null;
	let updateInputs: any[] | null = null;
	const personLoanLimitRepositoryMock = new Mock<PersonLoanLimitRepository>()
		.setup(async x => await x.get(It.IsAny<string>() as string, It.IsAny<string>() as string))
		.callback(async args => {
			getInputs = args.args;

			return await Promise.resolve(existingLoanLimit);
		})

		.setup(async x => await x.update(It.IsAny<PersonLoanLimitEntity>() as PersonLoanLimitEntity))
		.callback(async args => {
			updateInputs = args.args;

			return await Promise.resolve(args.args[0] as PersonLoanLimitEntity);
		})

		.setup(async x => {
			await x.create(It.IsAny<PersonLoanLimitEntity>() as PersonLoanLimitEntity);
		})
		.callback(async args => {
			createInputs = args.args;

			await Promise.resolve();
		});

	beforeEach(() => {
		getInputs = null;
		createInputs = null;
		updateInputs = null;
		getPersonWealthInfoInputs = [];
		findAllInputs = [];

		existingLoanLimit = null;
		wealthInfos = [
			{
				personId: '1',
				totalBalance: 100
			},
			{
				personId: '2',
				totalBalance: 500
			}
		];
	});

	it('has the correct job id', () => {
		const processHandler = new UpdateLoanLimitsProcessHandler(
			null as unknown as PersonRepository,
			null as unknown as PersonWealthInfoRepository,
			null as unknown as PersonLoanLimitRepository
		);

		expect(processHandler.id)
			.toEqual(UpdateProcessType.UpdateLoanLimit);
	});

	it('calculates the loan limits correctly between each friendship', async () => {
		const processHandler = new UpdateLoanLimitsProcessHandler(
			personRepositoryMock.object(),
			personWealthInfoRepositoryMock.object(),
			personLoanLimitRepositoryMock.object()
		);

		await processHandler.process({} as unknown as Job);

		expect(getPersonWealthInfoInputs)
			.toEqual(['1']);

		expect(findAllInputs)
			.toEqual([{
				where: {
					personId: In(['2'])
				}
			}]);

		expect(getInputs)
			.toEqual([
				'1',
				'2'
			]);

		const loanLimit = createInputs?.[0] as PersonLoanLimitEntity;
		expect(loanLimit)
			.toBeDefined();
		expect(loanLimit.personId)
			.toEqual('1');
		expect(loanLimit.friendId)
			.toEqual('2');
		expect(loanLimit.limit)
			.toEqual(400);

		expect(updateInputs)
			.toEqual(null);
	});

	it('calculates a zero loan limit for having a higher balance than a friend', async () => {
		const processHandler = new UpdateLoanLimitsProcessHandler(
			personRepositoryMock.object(),
			personWealthInfoRepositoryMock.object(),
			personLoanLimitRepositoryMock.object()
		);

		wealthInfos = [
			{
				personId: '1',
				totalBalance: 600
			},
			{
				personId: '2',
				totalBalance: 500
			}
		];

		await processHandler.process({} as unknown as Job);

		expect(getPersonWealthInfoInputs)
			.toEqual(['1']);

		expect(findAllInputs)
			.toEqual([{
				where: {
					personId: In(['2'])
				}
			}]);

		expect(getInputs)
			.toEqual([
				'1',
				'2'
			]);

		const loanLimit = createInputs?.[0] as PersonLoanLimitEntity;
		expect(loanLimit)
			.toBeDefined();
		expect(loanLimit.personId)
			.toEqual('1');
		expect(loanLimit.friendId)
			.toEqual('2');
		expect(loanLimit.limit)
			.toEqual(0);

		expect(updateInputs)
			.toEqual(null);
	});

	it('calculates a zero loan limit for the friend not having any wealth', async () => {
		const processHandler = new UpdateLoanLimitsProcessHandler(
			personRepositoryMock.object(),
			personWealthInfoRepositoryMock.object(),
			personLoanLimitRepositoryMock.object()
		);

		wealthInfos = [{
			personId: '1',
			totalBalance: 600
		}];

		await processHandler.process({} as unknown as Job);

		expect(getPersonWealthInfoInputs)
			.toEqual(['1']);

		expect(findAllInputs)
			.toEqual([{
				where: {
					personId: In(['2'])
				}
			}]);

		expect(getInputs)
			.toEqual([
				'1',
				'2'
			]);

		const loanLimit = createInputs?.[0] as PersonLoanLimitEntity;
		expect(loanLimit)
			.toBeDefined();
		expect(loanLimit.personId)
			.toEqual('1');
		expect(loanLimit.friendId)
			.toEqual('2');
		expect(loanLimit.limit)
			.toEqual(0);

		expect(updateInputs)
			.toEqual(null);
	});

	it('updates to a zero loan limit while having a precalculated loan limit', async () => {
		const processHandler = new UpdateLoanLimitsProcessHandler(
			personRepositoryMock.object(),
			personWealthInfoRepositoryMock.object(),
			personLoanLimitRepositoryMock.object()
		);

		wealthInfos = [
			{
				personId: '1',
				totalBalance: 600
			},
			{
				personId: '2',
				totalBalance: 500
			}
		];

		existingLoanLimit = new PersonLoanLimitEntity();
		existingLoanLimit.personId = '1';
		existingLoanLimit.friendId = '2';
		existingLoanLimit.limit = 100;
		existingLoanLimit.createdAt = new Date();
		existingLoanLimit.updatedAt = new Date();
		existingLoanLimit.id = '1';

		await processHandler.process({} as unknown as Job);

		expect(getPersonWealthInfoInputs)
			.toEqual(['1']);

		expect(findAllInputs)
			.toEqual([{
				where: {
					personId: In(['2'])
				}
			}]);

		expect(getInputs)
			.toEqual([
				'1',
				'2'
			]);

		const loanLimit = updateInputs?.[0] as PersonLoanLimitEntity;
		expect(loanLimit)
			.toBeDefined();
		expect(loanLimit.personId)
			.toEqual('1');
		expect(loanLimit.friendId)
			.toEqual('2');
		expect(loanLimit.limit)
			.toEqual(0);

		expect(createInputs)
			.toEqual(null);
	});
});
