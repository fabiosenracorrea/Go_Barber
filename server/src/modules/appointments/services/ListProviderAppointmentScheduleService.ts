import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments';

import IAppointmentRepository from '@modules/appointments/repositories/iAppointmentsRepository';
import iCacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentScheduleService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentRepository,

    @inject('CacheProvider')
    private cacheProvider: iCacheProvider,
  ) {}

  public async execute({
    month,
    day,
    provider_id,
    year,
  }: IRequest): Promise<Appointment[]> {
    // const data = await this.cacheProvider.recoverData('fabio');

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        day,
        month,
        year,
        provider_id,
      },
    );

    // await this.cacheProvider.save('fabio', 'gabio');

    return appointments;
  }
}

export default ListProviderAppointmentScheduleService;
