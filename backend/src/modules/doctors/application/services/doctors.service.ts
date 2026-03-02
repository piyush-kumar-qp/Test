import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Doctor } from '../../domain/entities/doctor.entity';
import { UsersService } from '../../../users/application/services/users.service';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateDoctorDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      role: UserRole.DOCTOR,
    });
    const doctor = this.doctorRepo.create({
      userId: user.id,
      speciality: dto.speciality,
      qualification: dto.qualification,
    });
    return this.doctorRepo.save(doctor);
  }

  async findAll() {
    return this.doctorRepo.find({
      relations: ['user'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    return this.doctorRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string) {
    return this.doctorRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
  }
}
