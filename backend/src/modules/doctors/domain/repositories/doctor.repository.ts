import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class DoctorRepository {
  constructor(
    @InjectRepository(Doctor)
    private readonly repository: Repository<Doctor>,
  ) {}

  create(partial: Pick<Doctor, 'userId' | 'speciality' | 'qualification'>): Doctor {
    return this.repository.create(partial);
  }

  save(doctor: Doctor): Promise<Doctor> {
    return this.repository.save(doctor);
  }

  findAllActive(): Promise<Doctor[]> {
    return this.repository.find({
      relations: ['user'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  findOneById(id: string): Promise<Doctor | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  findOneByUserId(userId: string): Promise<Doctor | null> {
    return this.repository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }
}
