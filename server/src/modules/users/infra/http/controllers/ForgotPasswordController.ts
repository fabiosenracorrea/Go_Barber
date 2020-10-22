import { Response, Request } from 'express';
import { container } from 'tsyringe';

import RecoverUserPasswordService from '@modules/users/services/RecoverUserPasswordService';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const recoverUserPasswordService = container.resolve(
      RecoverUserPasswordService,
    );

    await recoverUserPasswordService.execute({
      email,
    });

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const recoverUserPasswordService = container.resolve(ResetPasswordService);

    await recoverUserPasswordService.execute({
      password,
      token,
    });

    return response.status(204).json();
  }
}

export default ForgotPasswordController;
