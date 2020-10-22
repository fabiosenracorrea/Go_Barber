import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('Create Appointment Service', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appointment', async () => {
    const appointmentDate = new Date();
    const appointmentProvider = '123123123';

    const createdAppointment = await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
    });

    const startOfHourDate = startOfHour(appointmentDate);

    expect(createdAppointment).toHaveProperty('id');
    expect(createdAppointment.provider_id).toBe(appointmentProvider);
    expect(createdAppointment.date).toStrictEqual(startOfHourDate);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date();
    const appointmentProvider = '123123123';

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
    });

    expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: appointmentProvider,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
