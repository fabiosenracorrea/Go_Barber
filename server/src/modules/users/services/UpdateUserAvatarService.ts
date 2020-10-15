import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';

interface RequestTDO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: RequestTDO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only Authenticated users can change Avatar', 401);
    }
    // delete previous avatar
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const avatarExists = await fs.promises.stat(userAvatarFilePath);

      if (avatarExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default UpdateUserAvatarService;
