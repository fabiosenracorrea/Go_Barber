import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const { id: user_id } = request.user;

    const appointmentService = container.resolve(CreateAppointmentService);

    const appointment = await appointmentService.execute({
      user_id,
      provider_id,
      date,
    });

    return response.status(201).json(appointment);
  }
}

export default AppointmentsController;
