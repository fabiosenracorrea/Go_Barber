import { uuid } from 'uuidv4';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';

class UserTokensRepository implements iUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findToken = this.userTokens.find(tk => tk.token === token);

    return findToken;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    const created_at = Date.now();

    Object.assign(userToken, {
      id: uuid(),
      user_id,
      token: uuid(),
      created_at,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async delete(id: string): Promise<void> {}
}

export default UserTokensRepository;
