import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Appointment } from '../../../appointments/domain/entities/appointment.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(private config: ConfigService) {
    const host = this.config.get('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.config.get('SMTP_PORT') || 587,
        secure: false,
        auth: {
          user: this.config.get('SMTP_USER'),
          pass: this.config.get('SMTP_PASS'),
        },
      });
    }
  }

  async sendAppointmentConfirmationToDoctor(
    appointment: Appointment & {
      doctor?: { user?: { email?: string } };
      slot?: { date?: string; startTime?: string };
      patient?: { name?: string };
    },
  ) {
    if (!this.transporter) return;
    const doctorEmail = appointment.doctor?.user?.email;
    if (!doctorEmail) return;
    const subject = 'Appointment Confirmed';
    const text = `Your appointment has been confirmed. Patient: ${appointment.patient?.name ?? 'N/A'}. Slot: ${appointment.slot?.date ?? ''} ${appointment.slot?.startTime ?? ''}.`;
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM') || this.config.get('SMTP_USER'),
      to: doctorEmail,
      subject,
      text,
    });
  }
}
