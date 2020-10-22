import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

const profileRouter = Router();

const profileController = new ProfileController();

profileRouter.use(ensureAuth);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
