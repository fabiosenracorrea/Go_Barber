import iMailTemplate from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

class FakeMailTemplateProvider implements iMailTemplate {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeMailTemplateProvider;
