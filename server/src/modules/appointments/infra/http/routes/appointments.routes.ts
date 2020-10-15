import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuth);

// appointmentsRouter.get('/', async (request, response) => {

//   const appointments = await appointmentsRepository.find();

//   return response.status(200).json(appointments);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
