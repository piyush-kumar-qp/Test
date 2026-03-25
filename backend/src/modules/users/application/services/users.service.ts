import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserRole } from '../../domain/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: { email: string; password: string; name: string; role: UserRole }) {
    const existing = await this.userRepository.findOneByEmail(data.email);
    if (existing) throw new ConflictException('Email already registered');
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneByEmail(email);
  }

  async findById(id: string) {
    return this.userRepository.findOneById(id);
  }
}
