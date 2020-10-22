import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/fakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

import RecoverUserPasswordService from './RecoverUserPasswordService';

let fakeUsersRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let recoverUserPasswordService: RecoverUserPasswordService;

describe('Auth User Service Tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();

    fakeMailProvider = new FakeMailProvider();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    recoverUserPasswordService = new RecoverUserPasswordService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover password using email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'Fabio',
    };

    const createdUser = await fakeUsersRepository.create(user);

    await recoverUserPasswordService.execute({
      email: user.email,
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email to a non existing user', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const unregisteredEmail = 'fabio@gmail.com';

    expect(
      recoverUserPasswordService.execute({
        email: unregisteredEmail,
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMail).not.toHaveBeenCalled();
  });

  it('should generate a token for a valid password recover request', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = {
      email: 'fabio@gmail.com',
      password: '123456',
      name: 'Fabio',
    };

    const createdUser = await fakeUsersRepository.create(user);

    await recoverUserPasswordService.execute({
      email: user.email,
    });

    expect(generateToken).toHaveBeenCalledWith(createdUser.id);
  });
});
