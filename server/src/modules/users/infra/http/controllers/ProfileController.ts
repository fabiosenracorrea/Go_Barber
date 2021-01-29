import { Response, Request } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserInfoService from '@modules/users/services/UpdateUserInfoService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const showProfileService = container.resolve(ShowProfileService);

    const userInfo = await showProfileService.execute({
      user_id: id,
    });

    return response.status(201).json(classToClass(userInfo));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name, email, password, old_password } = request.body;

    const updateUserInfoService = container.resolve(UpdateUserInfoService);

    const updatedUser = await updateUserInfoService.execute({
      user_id: id,
      name,
      email,
      password,
      old_password,
    });

    return response.status(201).json(classToClass(updatedUser));
  }
}

export default ProfileController;
