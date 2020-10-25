import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import iProviderExceptionDTO from '@modules/users/dtos/iProviderExceptionDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findAllProviders(exception: iProviderExceptionDTO): Promise<User[]>;
  create(userData: ICreateUserDTO): Promise<User>;
  save(userData: ICreateUserDTO): Promise<User>;
}
