import { Router } from 'express';

import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';

const passwordRouter = Router();

const passwordController = new ForgotPasswordController();

passwordRouter.post('/forgot', passwordController.create);
passwordRouter.post('/reset', passwordController.update);

export default passwordRouter;
