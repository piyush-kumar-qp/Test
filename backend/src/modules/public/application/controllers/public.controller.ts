import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from '../../../doctors/application/services/doctors.service';
import { SlotsService } from '../../../slots/application/services/slots.service';

@Controller('api/public')
export class PublicController {
  constructor(
    private doctorsService: DoctorsService,
    private slotsService: SlotsService,
  ) {}

  @Get('doctors-and-slots')
  async doctorsAndSlots(@Query('speciality') speciality?: string, @Query('date') date?: string) {
    const [doctors, slots] = await Promise.all([
      this.doctorsService.findAll(),
      this.slotsService.findAvailable({ speciality, date }),
    ]);
    return { doctors, timeslots: slots };
  }
}
