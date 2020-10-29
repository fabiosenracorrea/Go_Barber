import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import MonthAvailabilityController from '@modules/appointments/infra/http/controllers/MonthAvailabilityController';
import DailyAvailabilityController from '@modules/appointments/infra/http/controllers/DailyAvailabilityController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new ProvidersController();
const monthAvailabilityController = new MonthAvailabilityController();
const dailyAvailabilityController = new DailyAvailabilityController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuth);

appointmentsRouter.get('/list', appointmentsController.index);

appointmentsRouter.get(
  '/appointments',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
      day: Joi.number().required(),
    },
  }),
  providerAppointmentsController.index,
);

appointmentsRouter.get(
  '/:id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
    },
  }),
  monthAvailabilityController.index,
);

appointmentsRouter.get(
  '/:id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      month: Joi.number().required(),
      year: Joi.number().required(),
      day: Joi.number().required(),
    },
  }),
  dailyAvailabilityController.index,
);

export default appointmentsRouter;
