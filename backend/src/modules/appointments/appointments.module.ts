import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './domain/entities/appointment.entity';
import { AppointmentsService } from './application/services/appointments.service';
import { AppointmentsController } from './application/controllers/appointments.controller';
import { SlotsModule } from '../slots/slots.module';
import { MailModule } from '../mail/mail.module';
import { AppointmentRepository } from './domain/repositories/appointment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), SlotsModule, MailModule],
  providers: [AppointmentRepository, AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService, AppointmentRepository],
})
export class AppointmentsModule {}
