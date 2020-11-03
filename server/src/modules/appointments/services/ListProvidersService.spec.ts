import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUserRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;

describe('Create User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the providers except for the logged user', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const user2 = {
      email: 'teste@gmail.com',
      password: '123456',
      name: 'teste',
    };

    const loggedUser = await fakeUsersRepository.create(newUser);
    await fakeUsersRepository.create(user2);

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    const loggedUserWasListed = providers.some(
      provider => provider.id === loggedUser.id,
    );

    expect(loggedUserWasListed).toBeFalsy();
  });
});
