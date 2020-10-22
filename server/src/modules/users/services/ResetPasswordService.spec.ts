import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providres/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('Auth User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'Fabio',
    };

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const createdUser = await fakeUsersRepository.create(user);

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    const newPassword = '123987';

    await resetPasswordService.execute({
      password: newPassword,
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);

    expect(
      await fakeHashProvider.compareHash(
        newPassword,
        updatedUser?.password as string,
      ),
    ).toBeTruthy();
  });

  it('should not be able to reset Password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123456',
        token: '32u749284932',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset Password with non-registered e-mail', async () => {
    const someFakeUserId = 'diuewidujifd0394e0324';

    const { token } = await fakeUserTokensRepository.generate(someFakeUserId);

    await expect(
      resetPasswordService.execute({
        password: '123456',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password after 2 hours of token generated', async () => {
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'Fabio',
    };

    const createdUser = await fakeUsersRepository.create(user);

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const newPassword = '123987';

    await expect(
      resetPasswordService.execute({
        password: newPassword,
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
