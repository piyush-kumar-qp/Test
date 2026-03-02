import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../../domain/entities/slot.entity';
import { CreateSlotDto } from '../dtos/create-slot.dto';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,
  ) {}

  async create(data: CreateSlotDto & { doctorId: string }) {
    const slot = this.slotRepo.create(data);
    return this.slotRepo.save(slot);
  }

  async findByDoctor(doctorId: string) {
    return this.slotRepo.find({
      where: { doctorId },
      relations: ['doctor', 'doctor.user'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  async findAvailable(filters?: { speciality?: string; date?: string }) {
    const qb = this.slotRepo
      .createQueryBuilder('slot')
      .leftJoinAndSelect('slot.doctor', 'doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('slot.isAvailable = :av', { av: true });
    if (filters?.speciality) {
      qb.andWhere('doctor.speciality = :spec', { spec: filters.speciality });
    }
    if (filters?.date) {
      qb.andWhere('slot.date = :date', { date: filters.date });
    }
    qb.orderBy('slot.date', 'ASC').addOrderBy('slot.startTime', 'ASC');
    return qb.getMany();
  }

  async findOne(id: string) {
    return this.slotRepo.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user'],
    });
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    await this.slotRepo.update(id, { isAvailable });
    return this.findOne(id);
  }
}
