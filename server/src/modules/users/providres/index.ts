import { container } from 'tsyringe';

import iHashProvider from '@modules/users/providres/HashProvider/models/IHashProvider';
import BCryptHashProvier from '@modules/users/providres/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<iHashProvider>('HashProvider', BCryptHashProvier);
