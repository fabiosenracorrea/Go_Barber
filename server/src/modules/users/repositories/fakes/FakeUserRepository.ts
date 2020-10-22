import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';

class UsersRepository implements iUsersRepository {
  public users: User[] = [];

  public async findByEmail(email: string): Promise<User | undefined> {
    const existentUser = this.users.find(user => user.email === email);

    return existentUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const existentUser = this.users.find(user => user.id === id);

    return existentUser;
  }

  public async create(userData: iCreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, userData, { id: uuid() });

    this.users.push(newUser);

    return newUser;
  }

  public async save(userData: User): Promise<User> {
    const oldUserIndex = this.users.findIndex(user => user.id === userData.id);

    this.users[oldUserIndex] = userData;

    return userData;
  }
}

export default UsersRepository;
