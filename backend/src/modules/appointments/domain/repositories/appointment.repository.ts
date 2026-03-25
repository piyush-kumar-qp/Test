import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class AppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  create(partial: Pick<Appointment, 'patientId' | 'doctorId' | 'slotId'>): Appointment {
    return this.repository.create(partial);
  }

  save(appointment: Appointment): Promise<Appointment> {
    return this.repository.save(appointment);
  }

  findOneByIdWithRelations(id: string): Promise<Appointment | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user', 'slot', 'patient'],
    });
  }

  findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: { patientId },
      relations: ['doctor', 'doctor.user', 'slot'],
      order: { createdAt: 'DESC' },
    });
  }

  findAllWithRelations(): Promise<Appointment[]> {
    return this.repository.find({
      relations: ['patient', 'doctor', 'doctor.user', 'slot'],
      order: { createdAt: 'DESC' },
    });
  }

  async mostBookedSpeciality(): Promise<Array<{ speciality: string; count: string }>> {
    return this.repository
      .createQueryBuilder('a')
      .innerJoin('a.doctor', 'd')
      .select('d.speciality', 'speciality')
      .addSelect('COUNT(*)', 'count')
      .groupBy('d.speciality')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async mostBookedDoctor(): Promise<
    Array<{
      doctorId: string;
      doctorName: string;
      speciality: string;
      count: string;
    }>
  > {
    return this.repository
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
  }

  async mostBookedTimeslot(): Promise<
    Array<{
      date: string;
      startTime: string;
      endTime: string;
      count: string;
    }>
  > {
    return this.repository
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
  }
}
