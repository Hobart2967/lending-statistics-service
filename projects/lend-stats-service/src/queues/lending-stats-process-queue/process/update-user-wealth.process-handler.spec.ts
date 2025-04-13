import { It, Mock } from 'moq.ts';
import { UpdateProcessType } from '../../../models/update-process-type';
import type { PersonWealthInfoRepository } from '../../../repositories/person-wealth-info.repository';
import { UpdateUserWealthProcessHandler } from './update-user-wealth.process-handler';
import type { PersonWealthInfoEntity } from '../../../entities/person-wealth-info.entity';

describe(UpdateUserWealthProcessHandler.name, () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const updateInputs: any[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const createInputs: any[] = [];
	const personalWealthInfoRepositoryMock = new Mock<PersonWealthInfoRepository>()
		.setup(async repo => await repo.calculatePersonWealthInfos())
		.returnsAsync([
			{
				personId: '1',
				totalBalance: 1000
			},
			{
				personId: '2',
				totalBalance: 2000
			},
			{
				personId: '3',
				totalBalance: 3000
			}
		] as never)

		.setup(async repo => await repo.getPersonWealthInfo('1'))
		.returnsAsync({
			personId: '1',
			totalBalance: 150.55
		} as never)

		.setup(async repo => await repo.getPersonWealthInfo('2'))
		.returnsAsync({
			personId: '2',
			totalBalance: 1852.34
		} as never)

		.setup(async repo => await repo.getPersonWealthInfo('3'))
		.returnsAsync(null as never)

		.setup(async repo => {
			await repo.create(It.IsAny<PersonWealthInfoEntity>() as PersonWealthInfoEntity);
		})
		.callback(async ({ args }) => {
			createInputs.push(args as never);

			await Promise.resolve();
		})

		.setup(async repo =>
			await repo.update(It.IsAny<PersonWealthInfoEntity>() as PersonWealthInfoEntity))
		.callback(async ({ args }) => {
			updateInputs.push(args as never);

			return await Promise.resolve(args[0] as PersonWealthInfoEntity);
		});

	it('has the correct job id', () => {
		const processHandler = new UpdateUserWealthProcessHandler(
			null as unknown as PersonWealthInfoRepository
		);

		expect(processHandler.id)
			.toEqual(UpdateProcessType.UpdatePersonWealth);
	});

	it('sums up all bank account balances and caches them', async () => {
		const processHandler = new UpdateUserWealthProcessHandler(
			personalWealthInfoRepositoryMock.object()
		);

		await processHandler.process({} as never);

		const [
			[user1],
			[user2]
		] = updateInputs;
		const [[user3]] = createInputs;

		expect(user1.totalBalance)
			.toEqual(1000);
		expect(user1.personId)
			.toEqual('1');
		expect(user2.totalBalance)
			.toEqual(2000);
		expect(user2.personId)
			.toEqual('2');
		expect(user3.totalBalance)
			.toEqual(3000);
		expect(user3.personId)
			.toEqual('3');
	});
});
