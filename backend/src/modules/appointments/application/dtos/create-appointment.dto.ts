import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'UUID of the slot to book', example: '123e4567-e89b-12d3-a456-426614174000', required: true })
  @IsUUID()
  slotId: string;
}
