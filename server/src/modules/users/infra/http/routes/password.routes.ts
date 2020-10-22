import { Router } from 'express';

import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';

import ensureAuth from '@modules/users/infra/http/middlewares/ensureAuth';

const passwordRouter = Router();

passwordRouter.use(ensureAuth);

const passwordController = new ForgotPasswordController();

passwordRouter.post('/forgot', passwordController.create);
passwordRouter.post('/reset', passwordController.update);

export default passwordRouter;
