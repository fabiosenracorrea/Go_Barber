import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

const appointmentDate = new Date();
const appointmentProvider = '123123123';
const user_id = '392u38928';

describe('Create Appointment Service', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const createdAppointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
      user_id,
    });

    const startOfHourDate = startOfHour(appointmentDate);

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(appointmentProvider);
    expect(createdAppointment.date).toStrictEqual(startOfHourDate);
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
      user_id,
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: appointmentProvider,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
