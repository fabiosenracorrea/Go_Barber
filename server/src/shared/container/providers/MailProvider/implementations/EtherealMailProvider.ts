import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import iMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import iSendMailDTO from '@shared/container/providers/MailProvider/dtos/iSendMailDTO';
import iMailTemplate from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

@injectable()
class EtherealMailProvider implements iMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: iMailTemplate,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: iSendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log(`Message sent: ${message.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export default EtherealMailProvider;
