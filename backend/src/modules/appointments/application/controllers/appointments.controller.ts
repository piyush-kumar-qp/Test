import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { Roles } from '../../../auth/application/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  create(@Body() dto: CreateAppointmentDto, @Req() req: { user: { id: string } }) {
    return this.appointmentsService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  myAppointments(@Req() req: { user: { id: string } }) {
    return this.appointmentsService.findByPatient(req.user.id);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  list() {
    return this.appointmentsService.findAll();
  } 
}
