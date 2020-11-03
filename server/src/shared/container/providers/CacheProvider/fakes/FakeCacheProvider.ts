import ICacheProvider from '@shared/container/providers/CacheProvider/models/iCacheProvider';

interface ICacheData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recoverData<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    return data ? JSON.parse(data) : null;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keyPattern = new RegExp(`$${prefix}:.+`);

    const keys = Object.keys(this.cache).filter(key => keyPattern.test(key));

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}

export default FakeCacheProvider;
