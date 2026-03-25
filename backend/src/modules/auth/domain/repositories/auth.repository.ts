import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../users/domain/repositories/user.repository';
import { User } from '../../../users/domain/entities/user.entity';

/**
 * Persistence access used by auth flows (login / JWT validation).
 * Delegates to {@link UserRepository} so services stay free of ORM details.
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly userRepository: UserRepository) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOneById(id);
  }
}
