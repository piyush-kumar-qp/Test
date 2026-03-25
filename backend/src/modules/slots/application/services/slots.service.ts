import { Injectable } from '@nestjs/common';
import { SlotRepository } from '../../domain/repositories/slot.repository';
import { CreateSlotDto } from '../dtos/create-slot.dto';

@Injectable()
export class SlotsService {
  constructor(private readonly slotRepository: SlotRepository) {}

  async create(data: CreateSlotDto & { doctorId: string }) {
    const slot = this.slotRepository.create(data);
    return this.slotRepository.save(slot);
  }

  async findByDoctor(doctorId: string) {
    return this.slotRepository.findByDoctorId(doctorId);
  }

  async findAvailable(filters?: { speciality?: string; date?: string }) {
    return this.slotRepository.findAvailable(filters);
  }

  async findOne(id: string) {
    return this.slotRepository.findOneById(id);
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    await this.slotRepository.updateAvailability(id, isAvailable);
    return this.slotRepository.findOneById(id);
  }
}
