import { Injectable, BadRequestException } from '@nestjs/common';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository';
import { SlotsService } from '../../../slots/application/services/slots.service';
import { MailService } from '../../../mail/application/services/mail.service';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private slotsService: SlotsService,
    private mailService: MailService,
  ) {}

  async create(patientId: string, dto: CreateAppointmentDto) {
    const slot = await this.slotsService.findOne(dto.slotId);
    if (!slot) throw new BadRequestException('Slot not found');
    if (!slot.isAvailable) throw new BadRequestException('Slot not available');
    const appointment = this.appointmentRepository.create({
      patientId,
      doctorId: slot.doctorId,
      slotId: slot.id,
    });
    const saved = await this.appointmentRepository.save(appointment);
    await this.slotsService.updateAvailability(slot.id, false);
    const withRelations = await this.appointmentRepository.findOneByIdWithRelations(saved.id);
    if (withRelations) await this.mailService.sendAppointmentConfirmationToDoctor(withRelations);
    return saved;
  }

  async findByPatient(patientId: string) {
    return this.appointmentRepository.findByPatientId(patientId);
  }

  async findAll() {
    return this.appointmentRepository.findAllWithRelations();
  }
}
