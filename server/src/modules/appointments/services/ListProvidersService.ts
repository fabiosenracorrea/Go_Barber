import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';

interface RequestDTO {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,
  ) {}

  public async execute({ user_id }: RequestDTO): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except: user_id,
    });

    return users;
  }
}

export default ListProvidersService;
