import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 6 characters)', minLength: 6, required: true })
  @IsString()
  @MinLength(6)
  password: string;
}
