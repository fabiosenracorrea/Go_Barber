import AppError from '@shared/errors/AppError';

import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';

import ListProviderAppointmentScheduleService from './ListProviderAppointmentScheduleService';

let fakeAppointmentRepository: FakeAppointmentRepository;
let listProvidersSchedule: ListProviderAppointmentScheduleService;

const appointmentProvider = '123123123';
const user_id = '392u38928';

describe('Create User Service Tests', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProvidersSchedule = new ListProviderAppointmentScheduleService(
      fakeAppointmentRepository,
    );
  });

  it('should list all appointments in one day from specific provider', async () => {
    const appointmentDate1 = new Date(2100, 4, 29, 12);
    const appointmentDate2 = new Date(2100, 4, 29, 14);

    const appointment1 = await fakeAppointmentRepository.create({
      date: appointmentDate1,
      provider_id: appointmentProvider,
      user_id,
    });

    const appointment2 = await fakeAppointmentRepository.create({
      date: appointmentDate2,
      provider_id: appointmentProvider,
      user_id,
    });

    const providerAppointments = await listProvidersSchedule.execute({
      day: 29,
      month: 5,
      year: 2100,
      provider_id: appointmentProvider,
    });

    expect(providerAppointments).toEqual([appointment1, appointment2]);
  });
});
