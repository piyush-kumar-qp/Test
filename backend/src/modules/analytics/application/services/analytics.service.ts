import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../../appointments/domain/entities/appointment.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {}

  async mostBookedSpeciality() {
    const raw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.doctor', 'd')
      .select('d.speciality', 'speciality')
      .addSelect('COUNT(*)', 'count')
      .groupBy('d.speciality')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return raw;
  }

  async mostBookedDoctor() {
    const raw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.doctor', 'd')
      .innerJoin('d.user', 'u')
      .select('d.id', 'doctorId')
      .addSelect('u.name', 'doctorName')
      .addSelect('d.speciality', 'speciality')
      .addSelect('COUNT(*)', 'count')
      .groupBy('d.id')
      .addGroupBy('u.name')
      .addGroupBy('d.speciality')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return raw;
  }

  async mostBookedTimeslot() {
    const raw = await this.appointmentRepo
      .createQueryBuilder('a')
      .innerJoin('a.slot', 's')
      .select('s.date', 'date')
      .addSelect('s.startTime', 'startTime')
      .addSelect('s.endTime', 'endTime')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.date')
      .addGroupBy('s.startTime')
      .addGroupBy('s.endTime')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
    return raw;
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
