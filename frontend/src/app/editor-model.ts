import { ContentElement } from './content-element';
import { HeadingElement } from './heading-element';
import { ImageElement } from './image-element';

export interface EditorModel {
  optionsVisible: boolean;
  content: Array<ImageElement | HeadingElement>;
  slashAppeardAt: string;
  dropdownIsFocused: boolean;
  enterClickedAt: string;
}
