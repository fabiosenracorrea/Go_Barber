import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';
import iHashProvider from '@modules/users/providres/HashProvider/models/IHashProvider';

interface RequestDTO {
  password: string;
  token: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: iUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: iHashProvider,
  ) {}

  public async execute({ password, token }: RequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Invalid Password Token', 403);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User Does Not Exist');
    }

    const MAX_WAITING_TIME_IN_HOURS = 2;
    const tokenCreatedAt = userToken.created_at;

    const resetPasswordTimeLimit = addHours(
      tokenCreatedAt,
      MAX_WAITING_TIME_IN_HOURS,
    );

    const maxWaitingTimeHasPassed = isAfter(Date.now(), resetPasswordTimeLimit);

    if (maxWaitingTimeHasPassed) {
      throw new AppError('Reset Token Expired');
    }

    const newHashedPassword = await this.hashProvider.generateHash(password);

    user.password = newHashedPassword;

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
