export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>;
  invalidate(key: string): Promise<void>;
  recoverData<T>(key: string): Promise<T | null>;
}
