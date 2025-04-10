import { Module } from '@nestjs/common';
import { UpdateStatisticsController } from './controllers/update-statistics.controller';
import { QueueService } from './services/queue.service';

@Module({
	imports: [],
	controllers: [UpdateStatisticsController],
	providers: [QueueService]
})
export class AppModule {}
