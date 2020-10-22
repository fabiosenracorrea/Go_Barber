import { Repository, getRepository } from 'typeorm';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';

class UserTokensRepository implements iUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findToken = await this.ormRepository.findOne({
      where: { token },
    });

    return findToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const createdToken = this.ormRepository.create({ user_id });

    await this.ormRepository.save(createdToken);

    return createdToken;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UserTokensRepository;
