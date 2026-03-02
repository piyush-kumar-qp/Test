import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { JwtAuthGuard } from '../../../auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/application/guards/roles.guard';
import { Roles } from '../../../auth/application/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  dashboard() {
    return this.analyticsService.dashboard();
  }
}
