import { Module } from '@nestjs/common';
import { PublicController } from './application/controllers/public.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [DoctorsModule, SlotsModule],
  controllers: [PublicController],
})
export class PublicModule {}
