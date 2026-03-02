import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { SlotsModule } from './modules/slots/slots.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { MailModule } from './modules/mail/mail.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { PublicModule } from './modules/public/public.module';
import { SeedModule } from './modules/seed/seed.module';
import { User } from './modules/users/domain/entities/user.entity';
import { Doctor } from './modules/doctors/domain/entities/doctor.entity';
import { Slot } from './modules/slots/domain/entities/slot.entity';
import { Appointment } from './modules/appointments/domain/entities/appointment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const host = config.get('DB_HOST', '127.0.0.1');
        const port = parseInt(config.get('DB_PORT') || '5432', 10);
        const username = config.get('DB_USERNAME', 'postgres');
        const password = config.get('DB_PASSWORD', 'admin');
        const database = config.get('DB_NAME', 'doctor_patient_db');
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Doctor, Slot, Appointment],
          synchronize: true,
          // logging: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DoctorsModule,
    SlotsModule,
    AppointmentsModule,
    MailModule,
    AnalyticsModule,
    PublicModule,
    SeedModule,
  ],
})
export class AppModule {}
