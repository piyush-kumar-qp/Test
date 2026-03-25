import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './domain/entities/slot.entity';
import { SlotsService } from './application/services/slots.service';
import { SlotsController } from './application/controllers/slots.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { SlotRepository } from './domain/repositories/slot.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Slot]), DoctorsModule],
  providers: [SlotRepository, SlotsService],
  controllers: [SlotsController],
  exports: [SlotsService],
})
export class SlotsModule {}
