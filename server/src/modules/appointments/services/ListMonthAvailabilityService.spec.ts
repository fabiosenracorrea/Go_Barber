import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListMonthAvailabilityService from './ListMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listMonthAvailabilityService: ListMonthAvailabilityService;

describe('ListProvidersAvailability ', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listMonthAvailabilityService = new ListMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list monthly availability', async () => {
    const day1ofTest = 20;
    const day2ofTest = 22;
    const dayNotFull = 21;
    const monthOfTest = 5;
    const yearOfTest = 2020;
    const maxAppointmentsInOneDay = 10;
    const firstHourPossible = 8;
    const fakeUserId = 'fiewjdi39';

    const eachAppointmentHour = Array.from(
      { length: maxAppointmentsInOneDay },
      (_, index) => index + firstHourPossible,
    );

    await Promise.all(
      eachAppointmentHour.map(async (hour: number) => {
        const appointment = await fakeAppointmentsRepository.create({
          provider_id: fakeUserId,
          date: new Date(yearOfTest, monthOfTest - 1, day1ofTest, hour, 0, 0),
        });

        return appointment;
      }),
    );

    await Promise.all(
      eachAppointmentHour.map(async (hour: number) => {
        const appointment = await fakeAppointmentsRepository.create({
          provider_id: fakeUserId,
          date: new Date(yearOfTest, monthOfTest - 1, day2ofTest, hour, 0, 0),
        });

        return appointment;
      }),
    );

    await fakeAppointmentsRepository.create({
      provider_id: fakeUserId,
      date: new Date(yearOfTest, monthOfTest - 1, dayNotFull, 12, 0, 0),
    });

    const availability = await listMonthAvailabilityService.execute({
      provider_id: fakeUserId,
      month: monthOfTest,
      year: yearOfTest,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: day1ofTest, available: false },
        { day: day2ofTest, available: false },
        { day: dayNotFull, available: true },
      ]),
    );
  });
});
