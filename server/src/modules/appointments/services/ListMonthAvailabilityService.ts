import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    month,
    provider_id,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        month,
        provider_id,
        year,
      },
    );

    const daysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: daysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const currentDay = new Date(year, month - 1, day, 23, 59, 59);
      const dateInThePast = isAfter(new Date(), currentDay);

      const appointmentsOnDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      const maxAppointmentsInOneDay = 10;

      return {
        day,
        available:
          appointmentsOnDay.length < maxAppointmentsInOneDay && !dateInThePast,
      };
    });

    return availability;
  }
}

export default ListMonthAvailabilityService;
