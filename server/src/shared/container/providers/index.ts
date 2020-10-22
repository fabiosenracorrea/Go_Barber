import { container } from 'tsyringe';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import iDiskStorageProvider from '@shared/container/providers/StorageProvider/models/iStorageProvider';

import MailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import iMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import HandleBarsMailTemplate from '@shared/container/providers/MailTemplateProvider/implementations/HandleBarsMailTemplate';
import iMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

container.registerSingleton<iDiskStorageProvider>(
  'DiskStorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<iMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplate,
);

container.registerInstance<iMailProvider>(
  'MailProvider',
  container.resolve(MailProvider),
);
