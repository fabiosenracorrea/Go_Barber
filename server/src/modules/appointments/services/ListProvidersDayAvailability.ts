import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    month,
    day,
    provider_id,
    year,
  }: IRequest): Promise<IResponse> {
    const dayAppointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        month,
        day,
        provider_id,
        year,
      },
    );

    const HOUR_START = 8;
    const MAX_APPOINTMENTS_DAY = 10;

    const eachHourArray = Array.from(
      {
        length: MAX_APPOINTMENTS_DAY,
      },
      (_, index) => index + HOUR_START,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = dayAppointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const requestedDate = new Date(year, month - 1, day, hour);
      const currentTimeIsBeforeRequestedTime = isAfter(
        requestedDate,
        currentDate,
      );

      return {
        hour,
        available: !hasAppointmentInHour && currentTimeIsBeforeRequestedTime,
      };
    });

    return availability;
  }
}

export default ListDayAvailabilityService;
