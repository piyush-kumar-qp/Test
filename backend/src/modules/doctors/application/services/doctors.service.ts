import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DoctorRepository } from '../../domain/repositories/doctor.repository';
import { UsersService } from '../../../users/application/services/users.service';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    private readonly doctorRepository: DoctorRepository,
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
    const doctor = this.doctorRepository.create({
      userId: user.id,
      speciality: dto.speciality,
      qualification: dto.qualification,
    });
    return this.doctorRepository.save(doctor);
  }

  async findAll() {
    return this.doctorRepository.findAllActive();
  }

  async findOne(id: string) {
    return this.doctorRepository.findOneById(id);
  }

  async findByUserId(userId: string) {
    return this.doctorRepository.findOneByUserId(userId);
  }
}
