import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseTDO {
  user: User;
  token: string;
}

@injectable()
class AuthUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,
  ) {}

  public async execute({ email, password }: RequestDTO): Promise<ResponseTDO> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // If user exists, we can acesses its property password!
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // user is authed

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthUserService;
