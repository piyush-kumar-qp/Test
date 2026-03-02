import { Controller, Get, Post, Body, UseGuards, Query, Req, ForbiddenException } from '@nestjs/common';
import { SlotsService } from '../services/slots.service';
import { CreateSlotDto } from '../dtos/create-slot.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { Roles } from '../../../auth/application/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { DoctorsService } from '../../../doctors/application/services/doctors.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('slots')
export class SlotsController {
  constructor(
    private slotsService: SlotsService,
    private doctorsService: DoctorsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR , UserRole.ADMIN)
  async create(@Body() dto: CreateSlotDto, @Req() req: { user: { id: string } }) {
    const doc = await this.doctorsService.findByUserId(req.user.id);
    if (!doc) throw new ForbiddenException();
    return this.slotsService.create({ ...dto, doctorId: doc.id });
  }

  @Get()
  @ApiBearerAuth()
  list(@Query('doctorId') doctorId?: string, @Query('speciality') speciality?: string, @Query('date') date?: string) {
    if (doctorId) return this.slotsService.findByDoctor(doctorId);
    return this.slotsService.findAvailable({ speciality, date });
  }
}
