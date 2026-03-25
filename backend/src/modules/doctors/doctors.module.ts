import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './domain/entities/doctor.entity';
import { DoctorsService } from './application/services/doctors.service';
import { DoctorsController } from './application/controllers/doctors.controller';
import { UsersModule } from '../users/users.module';
import { DoctorRepository } from './domain/repositories/doctor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), UsersModule],
  providers: [DoctorRepository, DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService],
})
export class DoctorsModule {}
