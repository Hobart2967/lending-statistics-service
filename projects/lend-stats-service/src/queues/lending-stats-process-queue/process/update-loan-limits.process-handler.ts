import type { Job } from 'bullmq';
import { ProcessHandler } from './process-handler';
import { UpdateProcessType } from '../../../models/update-process-type';
import { PersonWealthInfoRepository } from '../../../repositories/person-wealth-info.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PersonRepository } from '../../../repositories/person.repository';
import { PersonLoanLimitRepository } from '../../../repositories/person-loan-limit.repository';
import { In } from 'typeorm';
import { PersonLoanLimitEntity } from '../../../entities/person-loan-limit.entity';

@Injectable()
export class UpdateLoanLimitsProcessHandler extends ProcessHandler {
	// #region Private Fields
	private readonly log: Logger = new Logger(UpdateLoanLimitsProcessHandler.name);
	// #endregion

	// #region Public Fields
	public get id(): number {
		return UpdateProcessType.UpdateLoanLimit;
	}
	// #endregion

	// #region Ctor
	public constructor(
		private readonly personRepository: PersonRepository,
		private readonly personWealthRepository: PersonWealthInfoRepository,
		private readonly personLoanLimitRepository: PersonLoanLimitRepository
	) {
		super();
	}
	// #endregion

	// #region Public Methods
	public async process(_job: Job): Promise<void> {
		const persons = await this.personRepository.getAll();

		for (const person of persons) {
			this.log.debug('Updating loan limit for personId: ' + person.id);
			const personalWealthInfo = await this.personWealthRepository.getPersonWealthInfo(person.id);
			const personalBalance = personalWealthInfo?.totalBalance ?? 0;
			const friendships = await this.personRepository.getFriends(person.id);

			const friendIds = friendships.map(x => x.personBId);
			const wealthInfos = await this.personWealthRepository.findAll({
				where: {
					personId: In(friendIds)
				}
			});

			for (const friendId of friendIds) {
				this.log.debug('Calculate loan limit for friendId: ' + friendId);

				const friendWealthInfo = wealthInfos.find(x => x.personId === friendId);

				const loanLimit = new PersonLoanLimitEntity();
				loanLimit.personId = person.id;
				loanLimit.friendId = friendId;

				loanLimit.limit = friendWealthInfo && friendWealthInfo.totalBalance > personalBalance
					? friendWealthInfo.totalBalance - personalBalance
					: 0;

				const existing = await this.personLoanLimitRepository.get(loanLimit.personId, loanLimit.friendId);

				this.log.debug(`Updating loan limit of ${loanLimit.limit} for friendId: ${friendId}`);
				if (existing) {
					await this.personLoanLimitRepository.update(loanLimit);
				} else {
					await this.personLoanLimitRepository.create(loanLimit);
				}
			}
		}
	}
	// #endregion
}
