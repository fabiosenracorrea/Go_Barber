import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recoverData<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    return data ? JSON.parse(data) : null;
  }

  public async invalidate(key: string): Promise<void> {}
}

export default RedisCacheProvider;
