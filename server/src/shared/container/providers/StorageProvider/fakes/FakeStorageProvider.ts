import iStorageProvider from '@shared/container/providers/StorageProvider/models/iStorageProvider';

class FakeStorageProvider implements iStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const fileIndex = this.storage.findIndex(fileSaved => fileSaved === file);

    this.storage.splice(fileIndex, 1);
  }
}

export default FakeStorageProvider;
