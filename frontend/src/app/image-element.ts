import { ContentElement } from './content-element';

export interface ImageElement extends ContentElement {
  src: string;
  alt?: string;
}
