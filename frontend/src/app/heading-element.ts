import { ContentElement } from './content-element';

export interface HeadingElement extends ContentElement {
  type: 'Heading';
  level: 1 | 2 | 3;
  text: string;
}
