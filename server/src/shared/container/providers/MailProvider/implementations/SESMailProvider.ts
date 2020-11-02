import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import mailConfig from '@config/mail';

import iMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import iSendMailDTO from '@shared/container/providers/MailProvider/dtos/iSendMailDTO';
import iMailTemplate from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

@injectable()
class SESMailProvider implements iMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: iMailTemplate,
  ) {
    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2910-12-01',
        region: 'us-east-1',
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: iSendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export default SESMailProvider;
