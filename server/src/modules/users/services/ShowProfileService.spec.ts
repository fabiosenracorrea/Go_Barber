import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';

import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUserRepository;
let showProfileService: ShowProfileService;

describe('Create User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('return user info', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await fakeUsersRepository.create(newUser);

    const userInfo = await showProfileService.execute({
      user_id: createdUser.id,
    });

    expect(userInfo.email).toBe(newUser.email);
    expect(userInfo.name).toBe(newUser.name);
  });

  it('not return info of a non-existing user', async () => {
    const fakeID = '490493049';

    await expect(
      showProfileService.execute({
        user_id: fakeID,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
