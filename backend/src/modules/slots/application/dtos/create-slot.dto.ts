import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSlotDto {
  @ApiProperty({ description: 'Slot date (YYYY-MM-DD)', example: '2025-03-01', required: true })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Start time', example: '09:00', required: true })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time', example: '09:30', required: true })
  @IsString()
  endTime: string;
}
