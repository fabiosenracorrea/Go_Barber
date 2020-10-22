interface iTemplateVariables {
  [key: string]: string | number;
}

export default interface iParseTemplateDTO {
  file: string;
  variables: iTemplateVariables;
}
