import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../users/application/services/users.service';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.config.get('ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword = this.config.get('ADMIN_PASSWORD') || 'admin123';
    const existing = await this.usersService.findByEmail(adminEmail);
    if (existing) return;
    const hashed = await bcrypt.hash(adminPassword, 10);
    await this.usersService.create({
      email: adminEmail,
      password: hashed,
      name: 'Admin',
      role: UserRole.ADMIN,
    });
  }
}
