import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

interface RequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: iCacheProvider,
  ) {}

  public async execute({ user_id }: RequestDTO): Promise<User[]> {
    const cacheKey = `provider-list:${user_id}`;

    let users = await this.cacheProvider.recoverData<User[]>(cacheKey);

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except: user_id,
      });

      console.log('query no banco realizada!');

      await this.cacheProvider.save(cacheKey, classToClass(users));
    }

    return users;
  }
}

export default ListProvidersService;
