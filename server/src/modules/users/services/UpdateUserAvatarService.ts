import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iDiskStorageProvider from '@shared/container/providers/StorageProvider/models/iStorageProvider';

interface RequestTDO {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('DiskStorageProvider')
    private storageProvider: iDiskStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: RequestTDO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only Authenticated users can change Avatar', 401);
    }
    // delete previous avatar
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const newAvatarName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = newAvatarName;

    const updatedUser = await this.usersRepository.save(user);

    return updatedUser;
  }
}

export default UpdateUserAvatarService;
