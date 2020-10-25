import { Router } from 'express';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

const appointmentsRouter = Router();

const appointmentsController = new ProvidersController();

appointmentsRouter.use(ensureAuth);

appointmentsRouter.get('/list', appointmentsController.index);

export default appointmentsRouter;
