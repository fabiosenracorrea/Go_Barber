import { startOfHour, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

const appointmentDate = new Date(2100, 4, 29, 12);
const appointmentProvider = '123123123';
const user_id = '392u38928';

describe('Create Appointment Service', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
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

    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: appointmentProvider,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const dateToBlockAppointment = new Date(2020, 4, 27);

      return dateToBlockAppointment.getTime();
    });

    const dateInThePast = new Date(2020, 4, 20);

    await expect(
      createAppointmentService.execute({
        date: dateInThePast,
        provider_id: appointmentProvider,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an appointment that has provider and user with the same ID', async () => {
    await expect(
      createAppointmentService.execute({
        date: appointmentDate,
        provider_id: appointmentProvider,
        user_id: appointmentProvider,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an appointment before 8 or after 18', async () => {
    const appointmentHourBefore8 = new Date(2100, 4, 27, 7);
    const appointmentHourAfter18 = new Date(2100, 4, 27, 19);

    await expect(
      createAppointmentService.execute({
        date: appointmentHourBefore8,
        provider_id: appointmentProvider,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        date: appointmentHourAfter18,
        provider_id: appointmentProvider,
        user_id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should create a new notification after appointment is created', async () => {
    const createNotification = jest.spyOn(fakeNotificationRepository, 'create');

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
      user_id,
    });

    expect(createNotification).toHaveBeenCalled();
  });

  it('should invalidate previously saved cache', async () => {
    const createNotification = jest.spyOn(fakeCacheProvider, 'invalidate');

    const formatedDate = format(appointmentDate, 'yyy-M-d');
    const cacheKey = `provider-appointments:${appointmentProvider}:${formatedDate}`;

    await createAppointmentService.execute({
      date: appointmentDate,
      provider_id: appointmentProvider,
      user_id,
    });

    expect(createNotification).toHaveBeenCalled();
    expect(createNotification).toHaveBeenCalledWith(cacheKey);
  });
});
