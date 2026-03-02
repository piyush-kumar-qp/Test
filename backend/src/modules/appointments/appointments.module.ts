import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './domain/entities/appointment.entity';
import { AppointmentsService } from './application/services/appointments.service';
import { AppointmentsController } from './application/controllers/appointments.controller';
import { SlotsModule } from '../slots/slots.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), SlotsModule, MailModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
