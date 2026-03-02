import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DoctorsService } from '../services/doctors.service';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import { JwtAuthGuard } from '../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { Roles } from '../../../auth/application/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateDoctorDto) {   
    return this.doctorsService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  list() {
    return this.doctorsService.findAll();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.DOCTOR)
  me(@Req() req: { user: { id: string } }) {
    return this.doctorsService.findByUserId(req.user.id);
  }
}
