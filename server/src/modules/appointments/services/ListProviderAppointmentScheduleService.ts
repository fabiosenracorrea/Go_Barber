import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

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
class ListProviderAppointmentScheduleService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,
  ) {}

  public async execute({
    month,
    day,
    provider_id,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    );

    return appointments;
  }
}

export default ListProviderAppointmentScheduleService;
