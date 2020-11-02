import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';

  directory: string;

  uploadsFolder: string;

  config: {
    disk: {
      storage: StorageEngine;
    };
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  directory: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  config: {
    disk: {
      storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('hex');
          const fileName = `${fileHash}-${file.originalname}`;

          return callback(null, fileName);
        },
      }),
    },
    aws: {
      bucket: 'nome-do-bucket',
    },
  },
} as IUploadConfig;
