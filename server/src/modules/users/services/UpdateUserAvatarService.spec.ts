import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('Update User Avatar Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should update user avatar', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await fakeUsersRepository.create(newUser);

    const avatarName = 'avatar.jpg';

    const updatedUser = await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: avatarName,
    });

    expect(updatedUser.avatar).toBe(avatarName);
  });

  it('should not update non existing user avatar', async () => {
    const avatarName = 'avatar.jpg';
    const fakeId = 'wq2034920';

    await expect(
      updateUserAvatarService.execute({
        user_id: fakeId,
        avatarFilename: avatarName,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update user avatar if one already exists', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await fakeUsersRepository.create(newUser);

    const oldAvatarName = 'avatar.jpg';
    const newAvatarName = 'new.jpg';

    await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: oldAvatarName,
    });

    const updatedUser = await updateUserAvatarService.execute({
      user_id: createdUser.id,
      avatarFilename: newAvatarName,
    });

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarName);
    expect(updatedUser.avatar).toBe(newAvatarName);
  });
});
