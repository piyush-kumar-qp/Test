import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../entities/slot.entity';

export type NewSlotData = {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
};

@Injectable()
export class SlotRepository {
  constructor(
    @InjectRepository(Slot)
    private readonly repository: Repository<Slot>,
  ) {}

  create(data: NewSlotData): Slot {
    return this.repository.create(data);
  }

  save(slot: Slot): Promise<Slot> {
    return this.repository.save(slot);
  }

  findByDoctorId(doctorId: string): Promise<Slot[]> {
    return this.repository.find({
      where: { doctorId },
      relations: ['doctor', 'doctor.user'],
      order: { date: 'ASC', startTime: 'ASC' },
    });
  }

  findAvailable(filters?: { speciality?: string; date?: string }): Promise<Slot[]> {
    const qb = this.repository
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

  findOneById(id: string): Promise<Slot | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['doctor', 'doctor.user'],
    });
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<void> {
    await this.repository.update(id, { isAvailable });
  }
}
