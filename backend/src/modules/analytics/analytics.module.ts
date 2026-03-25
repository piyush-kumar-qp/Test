import { Module } from '@nestjs/common';
import { AnalyticsService } from './application/services/analytics.service';
import { AnalyticsController } from './application/controllers/analytics.controller';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [AppointmentsModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
