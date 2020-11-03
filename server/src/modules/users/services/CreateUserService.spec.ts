import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providres/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('Create User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should create a new user', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await createUserService.execute(newUser);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.name).toBe(newUser.name);
  });

  it('should not be able create a new user with existent email', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const anotherUser = {
      email: 'fabio@gmail.com',
      password: '09876',
      name: 'Joe',
    };

    await createUserService.execute(newUser);

    await expect(createUserService.execute(anotherUser)).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should create a hash of users password', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await createUserService.execute(newUser);

    const passwordHashed = fakeHashProvider.compareHash(
      newUser.password,
      createdUser.password,
    );

    expect(createdUser.password).not.toBe(newUser.password);
    expect(passwordHashed).toBeTruthy();
  });
});
