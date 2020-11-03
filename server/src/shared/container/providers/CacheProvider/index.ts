import { container } from 'tsyringe';

import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

import iCacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

const providers = {
  redis: container.resolve(RedisCacheProvider),
};

container.registerInstance<iCacheProvider>('CacheProvider', providers.redis);
