import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iHashProvider from '@modules/users/providres/HashProvider/models/IHashProvider';
import iCacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('HashProvider')
    private hashProvider: iHashProvider,

    @inject('CacheProvider')
    private cacheProvider: iCacheProvider,
  ) {}

  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already in use.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('provider-list');

    return user;
  }
}

export default CreateUserService;
