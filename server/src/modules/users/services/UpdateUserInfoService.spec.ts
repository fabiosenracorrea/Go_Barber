import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeHashProvider from '@modules/users/providres/HashProvider/fakes/FakeHashProvider';

import UpdateUserInfoService from './UpdateUserInfoService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserInfoService: UpdateUserInfoService;

describe('Update User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateUserInfoService = new UpdateUserInfoService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user info', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await fakeUsersRepository.create(newUser);

    const newName = 'Fábio Corrêa';
    const newEmail = 'fabio@hotmail.com';

    await updateUserInfoService.execute({
      user_id: createdUser.id,
      name: newName,
      email: newEmail,
    });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id);

    expect(updatedUser?.name).toBe(newName);
    expect(updatedUser?.email).toBe(newEmail);
  });

  it('should not update non-existing user', async () => {
    const fakeId = 'djsew89fuewf98';
    const newName = 'Fábio Corrêa';
    const newEmail = 'fabio@hotmail.com';

    await expect(
      updateUserInfoService.execute({
        user_id: fakeId,
        name: newName,
        email: newEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update to an existing email', async () => {
    const existingUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const anotherUser = {
      email: 'fabio@example.com',
      password: '123456',
      name: 'Carlos Fábio',
    };

    await fakeUsersRepository.create(existingUser);
    const userThatCantUpdate = await fakeUsersRepository.create(anotherUser);

    const notAllowedEmail = existingUser.email;

    await expect(
      updateUserInfoService.execute({
        user_id: userThatCantUpdate.id,
        name: anotherUser.name,
        email: notAllowedEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should update password', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const hashedPassword = await fakeHashProvider.generateHash(
      newUser.password,
    );

    const createdUser = await fakeUsersRepository.create({
      ...newUser,
      password: hashedPassword,
    });

    const newPassword = '9876543';

    const { password } = await updateUserInfoService.execute({
      user_id: createdUser.id,
      name: newUser.name,
      email: newUser.email,
      old_password: newUser.password,
      password: newPassword,
    });

    const newPasswordMatch = await fakeHashProvider.compareHash(
      newPassword,
      password,
    );

    expect(newPasswordMatch).toBeTruthy();
  });

  it('should update password only when old password correctly is provided', async () => {
    const newUser = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'fabio',
    };

    const createdUser = await fakeUsersRepository.create(newUser);

    const newPassword = '9876543';

    await expect(
      updateUserInfoService.execute({
        user_id: createdUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateUserInfoService.execute({
        user_id: createdUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newPassword,
        old_password: 'ASNIJCDISJS',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
