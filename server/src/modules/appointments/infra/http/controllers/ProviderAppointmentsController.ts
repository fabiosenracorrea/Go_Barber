import { Response, Request } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentScheduleService from '@modules/appointments/services/ListProviderAppointmentScheduleService';

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: provider_id } = request.user;
    const { day, month, year } = request.body;

    const listProvidersService = container.resolve(
      ListProviderAppointmentScheduleService,
    );

    const providerAppointments = await listProvidersService.execute({
      day,
      month,
      year,
      provider_id,
    });

    return response.status(200).json(providerAppointments);
  }
}

export default ProvidersController;