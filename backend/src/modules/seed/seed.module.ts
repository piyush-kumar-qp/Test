import { Module } from '@nestjs/common';
import { SeedService } from './application/services/seed.service';
import { SeedRepository } from './domain/repositories/seed.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SeedRepository, SeedService],
})
export class SeedModule {}
