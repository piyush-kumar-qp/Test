import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ description: 'Doctor email', example: 'doctor@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 6 characters)', minLength: 6, required: true })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Doctor full name', example: 'Dr. Jane Smith', minLength: 2, required: true })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Medical speciality', example: 'Cardiology', required: true })
  @IsString()
  speciality: string;

  @ApiProperty({ description: 'Qualifications', example: 'MD, MBBS', required: true })
  @IsString()
  qualification: string;
}
