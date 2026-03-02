import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../users/application/services/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterPatientDto } from '../dtos/register-patient.dto';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerPatient(dto: RegisterPatientDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
      role: UserRole.PATIENT,
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
