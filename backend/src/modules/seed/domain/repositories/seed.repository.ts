import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

@Injectable()
export class SeedRepository {
  constructor(private readonly userRepository: UserRepository) {}

  findUserByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  saveAdminUser(data: { email: string; password: string; name: string; role: UserRole }) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
