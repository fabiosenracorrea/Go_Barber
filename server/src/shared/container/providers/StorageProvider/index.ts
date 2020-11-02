import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import iDiskStorageProvider from '@shared/container/providers/StorageProvider/models/iStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<iDiskStorageProvider>(
  'DiskStorageProvider',
  providers[uploadConfig.driver],
);
