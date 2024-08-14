import { ContentElement } from './content-element';

export interface TextElement extends ContentElement {
  type: 'Text';
  level: 1 | 2 | 3 | 'Paragraph';
  text: string;
  children?: {
    startsAt: number;
    endsAt: number;
    style:
      | ['Italic']
      | ['Bold']
      | ['Line Through']
      | ['Italic', 'Bold']
      | ['Italic', 'Line Through']
      | ['Bold', 'Line Through']
      | ['Italic', 'Bold', 'Line Through'];
  }[];
}
