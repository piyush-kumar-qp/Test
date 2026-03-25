import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  create(data: { email: string; password: string; name: string; role: UserRole }): User {
    return this.repository.create(data);
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['doctor'],
    });
  }

  findOneById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['doctor'],
    });
  }
}
