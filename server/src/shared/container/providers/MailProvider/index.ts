import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

import iMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<iMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
