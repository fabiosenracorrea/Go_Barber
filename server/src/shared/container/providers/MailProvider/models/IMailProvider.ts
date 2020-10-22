import iSendMailDTO from '@shared/container/providers/MailProvider/dtos/iSendMailDTO';

export default interface IMailProvider {
  sendMail(mailData: iSendMailDTO): Promise<void>;
}
