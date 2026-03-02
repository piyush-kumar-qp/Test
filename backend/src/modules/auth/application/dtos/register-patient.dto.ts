import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterPatientDto {
  @ApiProperty({ description: 'User email', example: 'patient@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 6 characters)', minLength: 6, required: true })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe', minLength: 2, required: true })
  @IsString()
  @MinLength(2)
  name: string;
}
