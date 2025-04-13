import type { Job } from 'bullmq';
import { ProcessHandler } from './process-handler';
import { UpdateProcessType } from '../../../models/update-process-type';
import type { PersonWealthInfoEntity } from '../../../entities/person-wealth-info.entity';
import { PersonWealthInfoRepository } from '../../../repositories/person-wealth-info.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UpdateUserWorthProcessHandler extends ProcessHandler {
	// #region Private Fields
	private readonly log: Logger = new Logger(UpdateUserWorthProcessHandler.name);
	// #endregion

	// #region Public Fields
	public get id(): number {
		return UpdateProcessType.UpdatePersonWealth;
	}
	// #endregion

	// #region Ctor
	public constructor(
		private readonly personWealthRepository: PersonWealthInfoRepository
	) {
		super();
	}
	// #endregion

	// #region Public Methods
	public async process(_job: Job): Promise<void> {
		this.log.debug('Updating user worth');
		const wealthInfos: PersonWealthInfoEntity[] = await this.personWealthRepository.calculatePersonWealthInfos();

		for (const wealthInfoUpdate of wealthInfos) {
			this.log.debug('Updating user worth for personId: ' + wealthInfoUpdate.personId);
			this.log.debug('New total balance: ' + wealthInfoUpdate.totalBalance);

			const personWealthInfo = await this.personWealthRepository.getPersonWealthInfo(wealthInfoUpdate.personId);
			if (personWealthInfo) {
				this.log.debug('Previous total balance: ' + personWealthInfo.totalBalance);
				personWealthInfo.totalBalance = wealthInfoUpdate.totalBalance;
				await this.personWealthRepository.update(personWealthInfo);
			} else {
				this.log.debug('Previous total balance: 0');
				await this.personWealthRepository.create(wealthInfoUpdate);
			}
		}
	}
}
