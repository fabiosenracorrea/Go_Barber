import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';

import iUsersRepository from '@modules/users/repositories/iUsersRepository';
import iMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import iUserTokensRepository from '@modules/users/repositories/iUserTokensRepository';

interface RequestDTO {
  email: string;
}

@injectable()
class RecoverUserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: iUsersRepository,

    @inject('MailProvider')
    private mailProvider: iMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: iUserTokensRepository,
  ) {}

  public async execute({ email }: RequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email provided is not a registered user', 401);
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const emailTemplatePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    const resetLink = `${process.env.APP_WEB_URL}/reset-password?token=${token}`;

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: emailTemplatePath,
        variables: {
          name: user.name,
          link: resetLink,
        },
      },
    });
  }
}

export default RecoverUserPasswordService;
