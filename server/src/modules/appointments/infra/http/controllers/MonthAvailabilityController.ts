import { Response, Request } from 'express';
import { container } from 'tsyringe';

import ListMonthAvailabilityService from '@modules/appointments/services/ListMonthAvailabilityService';

class MonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { month, year } = request.query;
    const { id: provider_id } = request.params;

    const listMonthAvailabilityService = container.resolve(
      ListMonthAvailabilityService,
    );

    const availability = await listMonthAvailabilityService.execute({
      month: Number(month),
      year: Number(year),
      provider_id,
    });

    return response.status(200).json(availability);
  }
}

export default MonthAvailabilityController;
