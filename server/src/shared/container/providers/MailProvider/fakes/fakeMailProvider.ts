import iSendMailDTO from '@shared/container/providers/MailProvider/dtos/iSendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private messages: iSendMailDTO[] = [];

  public async sendMail(mailData: iSendMailDTO): Promise<void> {
    this.messages.push(mailData);
  }
}
