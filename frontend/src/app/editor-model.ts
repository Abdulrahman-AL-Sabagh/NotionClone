import { ContentElement } from './content-element';
import { HeadingElement } from './heading-element';
import { ImageElement } from './image-element';

export interface EditorModel {
  optionsVisible: boolean;
  content: ContentElement[];
  slashAppeardAt: string;
  dropdownIsFocused: boolean;
}
