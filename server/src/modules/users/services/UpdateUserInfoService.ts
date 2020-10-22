import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iHashProvider from '@modules/users/providres/HashProvider/models/IHashProvider';

interface RequestTDO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserInfoService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('HashProvider')
    private hashProvider: iHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: RequestTDO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail && user_id !== userWithSameEmail.id) {
      throw new AppError('Email already in use');
    }

    const updatedUserInfo = { ...user, name, email };

    if (password && !old_password) {
      throw new AppError(
        'You need to inform your old password to save a new one',
      );
    }

    if (password && old_password) {
      const oldPasswordMatch = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!oldPasswordMatch) {
        throw new AppError('Incorrect Old Password Provided');
      }

      updatedUserInfo.password = await this.hashProvider.generateHash(password);
    }

    const updatedUser = await this.usersRepository.save(updatedUserInfo);

    return updatedUser;
  }
}

export default UpdateUserInfoService;
