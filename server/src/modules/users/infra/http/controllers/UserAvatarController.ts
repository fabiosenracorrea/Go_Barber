import { Response, Request } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userAvatarService = container.resolve(UpdateUserAvatarService);

    const userUpdated = await userAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete userUpdated.password;

    return response.status(200).json(userUpdated);
  }
}

export default UserAvatarController;
