import { ContentElement } from './content-element';

export interface EditorModel {
  optionsVisible: boolean;
  content: ContentElement[];
  slashAppeardAt: string;
  dropdownIsFocused: boolean;
}
