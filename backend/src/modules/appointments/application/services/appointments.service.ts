import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../domain/entities/appointment.entity';
import { SlotsService } from '../../../slots/application/services/slots.service';
import { MailService } from '../../../mail/application/services/mail.service';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    private slotsService: SlotsService,
    private mailService: MailService,
  ) {}

  async create(patientId: string, dto: CreateAppointmentDto) {
    const slot = await this.slotsService.findOne(dto.slotId);
    if (!slot) throw new BadRequestException('Slot not found');
    if (!slot.isAvailable) throw new BadRequestException('Slot not available');
    const appointment = this.appointmentRepo.create({
      patientId,
      doctorId: slot.doctorId,
      slotId: slot.id,
    });
    const saved = await this.appointmentRepo.save(appointment);
    await this.slotsService.updateAvailability(slot.id, false);
    const withRelations = await this.appointmentRepo.findOne({
      where: { id: saved.id },
      relations: ['doctor', 'doctor.user', 'slot', 'patient'],
    });
    if (withRelations) await this.mailService.sendAppointmentConfirmationToDoctor(withRelations);
    return saved;
  }

  async findByPatient(patientId: string) {
    return this.appointmentRepo.find({
      where: { patientId },
      relations: ['doctor', 'doctor.user', 'slot'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return this.appointmentRepo.find({
      relations: ['patient', 'doctor', 'doctor.user', 'slot'],
      order: { createdAt: 'DESC' },
    });
  }
}
