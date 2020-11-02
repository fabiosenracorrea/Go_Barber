import { Response, Request } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthUserService from '@modules/users/services/AuthUserService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authUserService = container.resolve(AuthUserService);

    const { user, token } = await authUserService.execute({
      email,
      password,
    });

    return response.status(200).json({ user: classToClass(user), token });
  }
}

export default SessionsController;
