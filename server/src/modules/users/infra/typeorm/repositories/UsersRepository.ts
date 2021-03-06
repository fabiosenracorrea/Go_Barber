import { Repository, getRepository, Not } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import iProviderExceptionDTO from '@modules/users/dtos/iProviderExceptionDTO';

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

  public async findAllProviders({
    except,
  }: iProviderExceptionDTO): Promise<User[]> {
    let users: User[];

    if (except) {
      users = await this.ormRepository.find({
        where: { id: Not(except) },
      });
    } else {
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async create(userData: iCreateUserDTO): Promise<User> {
    const createdUser = this.ormRepository.create(userData);

    await this.ormRepository.save(createdUser);

    return createdUser;
  }

  public async save(userData: User): Promise<User> {
    await this.ormRepository.save(userData);

    const updatedUser = await this.ormRepository.findOne(userData.id);

    return updatedUser as User;
  }
}

export default UsersRepository;
