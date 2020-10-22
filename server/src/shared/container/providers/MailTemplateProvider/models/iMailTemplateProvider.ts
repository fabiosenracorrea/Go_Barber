import iParseTemplateDTO from '../dtos/iParseTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: iParseTemplateDTO): Promise<string>;
}
