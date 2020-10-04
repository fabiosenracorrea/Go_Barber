import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import ensureAuth from '../middlewares/ensureAuth';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuth);

appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  const appointments = await appointmentsRepository.find();

  return response.status(200).json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const dateFormatted = parseISO(date);

  const appointmentService = new CreateAppointmentService();

  const appointment = await appointmentService.execute({
    provider_id,
    date: dateFormatted,
  });

  return response.status(201).json(appointment);
});

export default appointmentsRouter;
