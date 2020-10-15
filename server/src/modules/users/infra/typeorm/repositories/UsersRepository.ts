import { Repository, getRepository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';

class UsersRepository implements iUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async create(userData: iCreateUserDTO): Promise<User> {
    const createdUser = this.ormRepository.create(userData);

    await this.ormRepository.save(createdUser);

    return createdUser;
  }

  public async save(userData: iCreateUserDTO): Promise<User> {
    const updatedUser = await this.ormRepository.save(userData);

    return updatedUser;
  }
}

export default UsersRepository;
