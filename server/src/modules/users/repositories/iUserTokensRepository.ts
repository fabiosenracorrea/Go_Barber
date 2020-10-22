import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUsersRepository {
  findByToken(token: string): Promise<UserToken | undefined>;
  generate(user_id: string): Promise<UserToken>;
  delete(id: string): Promise<void>;
}
