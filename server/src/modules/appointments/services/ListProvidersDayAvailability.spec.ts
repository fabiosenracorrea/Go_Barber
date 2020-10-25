import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListProvidersDayAvailability from './ListProvidersDayAvailability';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProvidersDayAvailability: ListProvidersDayAvailability;

describe('ListProvidersAvailability ', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProvidersDayAvailability = new ListProvidersDayAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list schedule from one day', async () => {
    const dayOfTest = 21;
    const monthOfTest = 5;
    const yearOfTest = 2020;
    const hourOfTest = 12;
    const firstAppointmentHour = 14;
    const secondAppointmentHour = 16;
    const fakeUserId = 'fiewjdi39';

    await fakeAppointmentsRepository.create({
      provider_id: fakeUserId,
      date: new Date(
        yearOfTest,
        monthOfTest - 1,
        dayOfTest,
        firstAppointmentHour,
        0,
        0,
      ),
    });

    await fakeAppointmentsRepository.create({
      provider_id: fakeUserId,
      date: new Date(
        yearOfTest,
        monthOfTest - 1,
        dayOfTest,
        secondAppointmentHour,
        0,
        0,
      ),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const testTime = new Date(
        yearOfTest,
        monthOfTest - 1,
        dayOfTest,
        hourOfTest,
        30,
      );

      return testTime.getTime();
    });

    const availability = await listProvidersDayAvailability.execute({
      provider_id: fakeUserId,
      day: dayOfTest,
      month: monthOfTest,
      year: yearOfTest,
    });

    expect(availability).toEqual([
      { hour: 8, available: false },
      { hour: 9, available: false },
      { hour: 10, available: false },
      { hour: 11, available: false },
      { hour: 12, available: false },
      { hour: 13, available: true },
      { hour: firstAppointmentHour, available: false },
      { hour: 15, available: true },
      { hour: secondAppointmentHour, available: false },
      { hour: 17, available: true },
    ]);
  });
});
