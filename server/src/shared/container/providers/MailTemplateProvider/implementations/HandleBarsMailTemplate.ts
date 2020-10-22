import handlebars from 'handlebars';
import fs from 'fs';

import iMailTemplate from '@shared/container/providers/MailTemplateProvider/models/iMailTemplateProvider';

import iParseTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/iParseTemplateDTO';

class HandleBarsMailTemplate implements iMailTemplate {
  public async parse({ file, variables }: iParseTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandleBarsMailTemplate;
