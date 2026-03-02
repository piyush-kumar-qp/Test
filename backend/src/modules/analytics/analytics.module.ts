import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../appointments/domain/entities/appointment.entity';
import { AnalyticsService } from './application/services/analytics.service';
import { AnalyticsController } from './application/controllers/analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
