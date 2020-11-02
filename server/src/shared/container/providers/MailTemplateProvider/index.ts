import { container } from 'tsyringe';

import HandleBarsMailTemplate from '@shared/container/providers/MailTemplateProvider/implementations/HandleBarsMailTemplate';
import iMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

container.registerSingleton<iMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplate,
);
