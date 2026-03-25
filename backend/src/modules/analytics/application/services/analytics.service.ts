import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from '../../../appointments/domain/repositories/appointment.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async mostBookedSpeciality() {
    return this.appointmentRepository.mostBookedSpeciality();
  }

  async mostBookedDoctor() {
    return this.appointmentRepository.mostBookedDoctor();
  }

  async mostBookedTimeslot() {
    return this.appointmentRepository.mostBookedTimeslot();
  }

  async dashboard() {
    const [speciality, doctor, timeslot] = await Promise.all([
      this.mostBookedSpeciality(),
      this.mostBookedDoctor(),
      this.mostBookedTimeslot(),
    ]);
    return { mostBookedSpeciality: speciality, mostBookedDoctor: doctor, mostBookedTimeslot: timeslot };
  }
}
