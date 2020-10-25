import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import MonthAvailabilityController from '@modules/appointments/infra/http/controllers/MonthAvailabilityController';
import DailyAvailabilityController from '@modules/appointments/infra/http/controllers/DailyAvailabilityController';

const appointmentsRouter = Router();

const appointmentsController = new ProvidersController();
const monthAvailabilityController = new MonthAvailabilityController();
const dailyAvailabilityController = new DailyAvailabilityController();

appointmentsRouter.use(ensureAuth);

appointmentsRouter.get('/list', appointmentsController.index);
appointmentsRouter.post(
  '/:id/month-availability',
  monthAvailabilityController.index,
);
appointmentsRouter.post(
  '/:id/day-availability',
  dailyAvailabilityController.index,
);

export default appointmentsRouter;
