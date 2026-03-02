import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../../users/domain/entities/user.entity';
import { Doctor } from '../../../doctors/domain/entities/doctor.entity';
import { Slot } from '../../../slots/domain/entities/slot.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  patient: User;

  @Column()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { onDelete: 'CASCADE' })
  @JoinColumn()
  doctor: Doctor;

  @Column()
  slotId: string;

  @ManyToOne(() => Slot, (slot) => slot.appointments, { onDelete: 'CASCADE' })
  @JoinColumn()
  slot: Slot;

  @Column({ default: 'confirmed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
