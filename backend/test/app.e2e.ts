import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/application/services/auth.service';
import { DoctorsService } from '../src/modules/doctors/application/services/doctors.service';
import { SlotsService } from '../src/modules/slots/application/services/slots.service';
import { AppointmentsService } from '../src/modules/appointments/application/services/appointments.service';
import { AnalyticsService } from '../src/modules/analytics/application/services/analytics.service';
import { JwtAuthGuard } from '../src/modules/auth/application/guards/jwt-auth.guard';
import { RolesGuard } from '../src/modules/auth/application/guards/roles.guard';

const mockUser = { id: 'user-1', role: 'admin' };

const mockAuthGuard = {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = mockUser;
    return true;
  },
};

const mockRoleGuard = {
  canActivate() {
    return true;
  },
};

describe('Backend E2E - all endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRoleGuard)
      .overrideProvider(AuthService)
      .useValue({
        registerPatient: async (dto: any) => ({ id: 10, ...dto }),
        login: async (email: string, password: string) => ({ accessToken: 'fake-token', email }),
      })
      .overrideProvider(DoctorsService)
      .useValue({
        create: async (dto: any) => ({ id: 1, ...dto }),
        findAll: async () => [
          { id: 1, firstName: 'Jane', lastName: 'Doe', speciality: 'Cardiology' },
        ],
        findByUserId: async (userId: string) =>
          userId === 'user-1'
            ? { id: 1, userId: 'user-1', firstName: 'Jane', lastName: 'Doe', speciality: 'Cardiology' }
            : null,
      })
      .overrideProvider(SlotsService)
      .useValue({
        create: async (dto: any) => ({ id: 1, ...dto }),
        findAvailable: async () => [
          { id: 1, doctorId: 1, date: '2026-01-01', time: '09:00', isBooked: false },
        ],
        findByDoctor: async (doctorId: string) => [
          { id: 1, doctorId, date: '2026-01-01', time: '09:00', isBooked: false },
        ],
      })
      .overrideProvider(AppointmentsService)
      .useValue({
        create: async (patientId: string, dto: any) => ({ id: 5, patientId, ...dto }),
        findByPatient: async (patientId: string) => [
          { id: 5, patientId, slotId: 1, status: 'booked' },
        ],
        findAll: async () => [
          { id: 5, patientId: 'user-1', slotId: 1, status: 'booked' },
        ],
      })
      .overrideProvider(AnalyticsService)
      .useValue({
        dashboard: async () => ({ totalDoctors: 10, totalPatients: 30, totalAppointments: 20 }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) should register patient', async () => {
    const payload = { email: 'a@b.com', password: 'pass', firstName: 'John', lastName: 'Doe' };
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(payload)
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toMatchObject({ id: 10, email: payload.email });
      });
  });

  it('/auth/login (POST) should return token', async () => {
    const payload = { email: 'a@b.com', password: 'pass' };
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('accessToken');
      });
  });

  it('/api/public/doctors-and-slots (GET) should return doctors and slots', async () => {
    await request(app.getHttpServer())
      .get('/api/public/doctors-and-slots')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body.doctors).toHaveLength(1);
        expect(res.body.timeslots).toHaveLength(1);
      });
  });

  it('/doctors (POST) should create a doctor', async () => {
    const payload = { firstName: 'Jane', lastName: 'Doe', speciality: 'Cardiology' };
    await request(app.getHttpServer())
      .post('/doctors')
      .send(payload)
      .set('Authorization', 'Bearer fake')
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toMatchObject(payload);
      });
  });

  it('/doctors (GET) should list doctors', async () => {
    await request(app.getHttpServer())
      .get('/doctors')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('/doctors/me (GET) should return current doctor', async () => {
    await request(app.getHttpServer())
      .get('/doctors/me')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveProperty('userId', 'user-1');
      });
  });

  it('/slots (POST) should create slot', async () => {
    const payload = { date: '2026-01-02', time: '10:00' };
    await request(app.getHttpServer())
      .post('/slots')
      .send(payload)
      .set('Authorization', 'Bearer fake')
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toMatchObject(payload);
      });
  });

  it('/slots (GET) with doctorId should return slots by doctor', async () => {
    await request(app.getHttpServer())
      .get('/slots')
      .query({ doctorId: '1' })
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body[0]).toHaveProperty('doctorId', '1');
      });
  });

  it('/slots (GET) without doctorId should return available slots', async () => {
    await request(app.getHttpServer())
      .get('/slots')
      .query({ speciality: 'Cardiology', date: '2026-01-01' })
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body[0]).toHaveProperty('isBooked', false);
      });
  });

  it('/appointments (POST) should create appointment', async () => {
    const payload = { slotId: 1, notes: 'Checkup' };
    await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', 'Bearer fake')
      .send(payload)
      .expect(201)
      .then((res: request.Response) => {
        expect(res.body).toMatchObject({ patientId: 'user-1', slotId: 1 });
      });
  });

  it('/appointments/my (GET) should return user appointments', async () => {
    await request(app.getHttpServer())
      .get('/appointments/my')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('patientId', 'user-1');
      });
  });

  it('/appointments (GET) should return all appointments', async () => {
    await request(app.getHttpServer())
      .get('/appointments')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toHaveLength(1);
      });
  });

  it('/analytics (GET) should return dashboard stats', async () => {
    await request(app.getHttpServer())
      .get('/analytics')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .then((res: request.Response) => {
        expect(res.body).toMatchObject({ totalDoctors: 10, totalPatients: 30, totalAppointments: 20 });
      });
  });
});
