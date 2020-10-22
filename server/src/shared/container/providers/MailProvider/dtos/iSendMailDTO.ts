import iParseMailDTO from '@shared/container/providers/MailTemplateProvider/dtos/iParseTemplateDTO';

interface iMailContact {
  name: string;
  email: string;
}

export default interface iSendMailDTO {
  to: iMailContact;
  from?: iMailContact;
  subject: string;
  templateData: iParseMailDTO;
}
