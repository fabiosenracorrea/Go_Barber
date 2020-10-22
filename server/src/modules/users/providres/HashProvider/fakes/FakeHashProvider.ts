import IHashProvider from '@modules/users/providres/HashProvider/models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload.split('').reverse().join('');
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const deHashed = hashed.split('').reverse().join('');

    return payload === deHashed;
  }
}

export default FakeHashProvider;
