import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SeedRepository } from '../../domain/repositories/seed.repository';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly seedRepository: SeedRepository,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.config.get('ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword = this.config.get('ADMIN_PASSWORD') || 'admin123';
    const existing = await this.seedRepository.findUserByEmail(adminEmail);
    if (existing) return;
    const hashed = await bcrypt.hash(adminPassword, 10);
    await this.seedRepository.saveAdminUser({
      email: adminEmail,
      password: hashed,
      name: 'Admin',
      role: UserRole.ADMIN,
    });
  }
}
