import { ContentElement } from './content-element';
import { TextElementChild } from './text-element-child';

export interface TextElement extends ContentElement {
  type: 'Text';
  level: 1 | 2 | 3 | 'Paragraph';
  text: string;
  hasPlaceHolder: boolean;
  children: TextElementChild[];
}
