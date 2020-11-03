import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providres/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AuthUserService from './AuthUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;
let authUserService: AuthUserService;

describe('Auth User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    authUserService = new AuthUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await createUserService.execute(user);

    const response = await authUserService.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toStrictEqual(createdUser);
  });

  it('should not be able to Auth user with a not existent email', async () => {
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const wrongEmail = 'fabio@gmail.com.br';

    await createUserService.execute(user);

    await expect(
      authUserService.execute({
        email: wrongEmail,
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to Auth user with wrong password', async () => {
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const wrongPassword = '12345';
    const anotherWrongPassword = '654321';

    await createUserService.execute(user);

    await expect(
      authUserService.execute({
        email: user.email,
        password: wrongPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      authUserService.execute({
        email: user.email,
        password: anotherWrongPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
