import { Response, Request } from 'express';
import { container } from 'tsyringe';

import ListProvidersDayAvailability from '@modules/appointments/services/ListProvidersDayAvailability';

class DailyAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year, day } = request.query;
    const { id: provider_id } = request.params;

    const listProvidersDayAvailability = container.resolve(
      ListProvidersDayAvailability,
    );

    const availability = await listProvidersDayAvailability.execute({
      day: Number(day),
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return response.status(200).json(availability);
  }
}

export default DailyAvailabilityController;
